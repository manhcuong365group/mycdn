/**
 * Product Configuration Controller v1.0
 * Specialized logic for pricing and specs across Auto365 ecosystem domains.
 */
(function () {
  function run() {
    // ================= DOM PRICE PARSER =================
    function extractBasePrice(container) {
      if (!container) return 0;
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const match = node.nodeValue.match(/([\d\.]+)\s*VNĐ/i);
        if (match) {
          return parseInt(match[1].replace(/\./g, ""), 10);
        }
      }
      return 0;
    }

    function updatePriceInDOM(container, newPrice) {
      if (!container) return;
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const formatted = newPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      let node;
      while ((node = walker.nextNode())) {
        if (/VNĐ/i.test(node.nodeValue)) {
          node.nodeValue = node.nodeValue.replace(
            /([\d\.]+)(\s*VNĐ)/i,
            formatted + "$2",
          );
        }
      }
    }

    // ================= CORE =================
    class ProductController {
      constructor(configs) {
        this.configs = configs;
        this.activeConfig = null;
        this.priceUnit = document.querySelector(".price-unit");
        this.basePrice = 0;
        this.priceFormat = "";
        this.specCache = {};
        this.baseSpecs = {};
      }

      init() {
        this.detectConfig();
        if (!this.activeConfig) return;

        this.cacheSpecs();
        this.initBaseSpecs();
        this.basePrice = this.getBasePrice();
        this.priceFormat = this.getPriceFormat();

        this.activeConfig.initAction?.();
        this.bindEvents();
        this.syncInitialState();
      }

      detectConfig() {
        const url = location.href;
        this.activeConfig = this.configs.find((c) =>
          c.patterns.some((p) => url.includes(p)),
        );
      }

      getBasePrice() {
        if (!this.priceUnit) return 0;
        const nums = this.priceUnit.textContent.match(/[\d.,]+/g);
        return nums ? parseInt(nums.pop().replace(/[^\d]/g, ""), 10) : 0;
      }

      getPriceFormat() {
        return this.priceUnit
          ? " " + this.priceUnit.textContent.replace(/[\d.,]/g, "").trim()
          : "";
      }

      formatPrice(num) {
        return (
          num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
          this.priceFormat
        );
      }

      updatePrice(name) {
        if (!this.priceUnit) return;
        const adjust = this.activeConfig.priceAdjustments?.[name] || 0;
        const final = this.basePrice + adjust;
        this.priceUnit.textContent = this.formatPrice(final);
      }

      cacheSpecs() {
        const find = (key) =>
          Array.from(document.querySelectorAll("td")).find((td) =>
            td.textContent.toLowerCase().includes(key),
          )?.nextElementSibling;

        this.specCache = {
          chanBong: find("chân bóng"),
          congSuat: find("công suất"),
          nhanLed: find("nhân led"),
          dienAp: find("điện áp"),
        };
      }

      initBaseSpecs() {
        Object.keys(this.specCache).forEach((k) => {
          this.baseSpecs[k] = this.specCache[k]?.innerHTML || "";
        });
      }

      applySpec(spec) {
        Object.keys(this.specCache).forEach((k) => {
          if (this.specCache[k]) {
            this.specCache[k].innerHTML = spec?.[k] || this.baseSpecs[k];
          }
        });
      }

      bindEvents() {
        document.addEventListener("click", (e) => {
          const btn = e.target.closest(
            ".box-classify-item, .box-gallery-control .item",
          );
          if (!btn) return;
          const name =
            btn.dataset.value ||
            btn.textContent.trim() ||
            btn.querySelector("p")?.textContent.trim();
          if (!name) return;
          this.setActive(btn);
          this.handleClick(name);
        });
      }

      setActive(btn) {
        const group = btn.closest(".box-classify, .box-gallery-control");
        if (!group) return;
        group
          .querySelectorAll(".active")
          .forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");
      }

      handleClick(name) {
        this.updatePrice(name);
        const spec = this.activeConfig.specs?.[name];
        this.applySpec(spec);
        this.activeConfig.customAction?.(name);
      }

      syncInitialState() {
        const btn = document.querySelector(".box-classify-item.active");
        if (!btn) return;
        const name = btn.dataset.value || btn.textContent.trim();
        this.handleClick(name);
      }
    }

    // ================= CONFIGS =================
    const CONFIGS = [
      {
        patterns: ["bong-led-x-light-s3-pro-v2"],
        priceAdjustments: { H4: 100000 },
      },
      {
        patterns: ["bong-led-x-light-s6-pro-v2"],
        priceAdjustments: {
          H4: 200000,
          "D1/D3": 500000,
          "D2/D4": 500000,
        },
        specs: {
          "D1/D3": {
            chanBong: "D1/D3, D2/D4",
            congSuat: "~45W",
            nhanLed: "15+15 Flip chip",
          },
          "D2/D4": {
            chanBong: "D1/D3, D2/D4",
            congSuat: "~45W",
            nhanLed: "15+15 Flip chip",
          },
        },
      },
      {
        patterns: ["bi-gam-f10-turbo-v2"],
        priceAdjustments: { "24V": 200000 },
        specs: {
          "12-16V": { dienAp: "12V - 16V" },
          "24V": { dienAp: "24V" },
        },
        initAction() {
          const wait = () => {
            const anchor = document.getElementById(
              "3-gi--b-n-v--ch-----b--o-h-nh-c--a---n-bi-g--m-x-light-f10-turbo-v2",
            );
            if (!anchor) return setTimeout(wait, 100);
            const h2 = anchor.closest("h2");
            if (!h2) return;
            const p = h2.nextElementSibling;
            if (p && !p.dataset.basePrice) {
              const base = extractBasePrice(p);
              if (base) p.dataset.basePrice = base;
            }
            if (!document.getElementById("content-24v-extra")) {
              const div = document.createElement("div");
              div.id = "content-24v-extra";
              div.style.display = "none";
              div.innerHTML = `
                                <h3 style=\"line-height: 1.8; margin-top: 13px; margin-bottom: 13px; text-align: justify;\">
                                    <span style=\"font-size:22px;\">
                                        <span style=\"font-family:Arial,Helvetica,sans-serif;\">
                                            <span style=\"line-height:2;\">
                                                <span style=\"font-variant:normal;\">
                                                    <span style=\"color:#000000;\">
                                                        <span style=\"font-weight:700;\">
                                                            <span style=\"font-style:normal;\">
                                                                2.4. Hỗ trợ sử dụng điện áp 24V
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </span>
                                        </span>
                                    </span>
                                </h3>
                                <p style=\"text-align: justify; margin-bottom: 15px;\">
                                    <span style=\"font-size:18px;color:#000000;\">
                                        <span style=\"font-family:Arial,Helvetica,sans-serif;\">
                                            Bên cạnh khả năng hoạt động ở dải điện áp 12-16V cho xe ô tô cỡ nhỏ, X-Light F10 Turbo V2 còn có phiên bản 24V dành riêng cho các dòng xe tải lớn. Việc sử dụng đúng điện áp giúp đèn vận hành ổn định, không cần chuyển đổi nguồn, đồng thời đảm bảo hiệu suất chiếu sáng và độ bền khi xe thường xuyên hoạt động liên tục.
                                        </span>
                                    </span>
                                </p>
                            `;
              h2.parentNode.insertBefore(div, h2);
            }
          };
          wait();
        },
        customAction(name) {
          const wait = () => {
            const anchor = document.getElementById(
              "3-gi--b-n-v--ch-----b--o-h-nh-c--a---n-bi-g--m-x-light-f10-turbo-v2",
            );
            const el = document.getElementById("content-24v-extra");
            if (!anchor || !el) return setTimeout(wait, 100);
            const h2 = anchor.closest("h2");
            const p = h2?.nextElementSibling;
            const is24 = name.trim().toLowerCase() === "24v";
            el.style.display = is24 ? "block" : "none";
            if (p && p.dataset.basePrice) {
              const base = parseInt(p.dataset.basePrice, 10);
              const final = is24 ? base + 200000 : base;
              updatePriceInDOM(p, final);
            }
          };
          wait();
        },
      },
    ];

    new ProductController(CONFIGS).init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
