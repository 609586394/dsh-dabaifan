window.__ModuleLoader__.load({
  id: "dsh-dabaifan",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    let react = require("react");

    const PANEL_ID = "dabaifan";
    const AI_KEY = "dbf-ai-7k2m9x4q"; // 公开的插件通道钥匙
    // 两条路，按顺序试。前面那条通了就一直用，八秒没回声就换下一条。
    // 页面加载成功时会往父窗口喊一声 { dbf: 'alive' } —— 收不到就是没连上。
    const SITES = [
      "https://wall.dabaifan.workers.dev",
      "https://dabaifan.xyz"
    ];
    const WAIT_MS = 8000;

    function entryOf(site) {
      return site + "/enter?k=" + encodeURIComponent(AI_KEY);
    }

    function WhaleIcon(props) {
      const size = props && typeof props.size === "number" ? props.size : 20;
      return react.createElement(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true"
        },
        react.createElement("path", {
          d: "M3.6 12.8c0-3.9 3.2-7 7.1-7 2.7 0 5 1.5 6.2 3.7.4-.2.9-.3 1.4-.3 1.6 0 2.9 1.3 2.9 2.9 0 .5-.1 1-.4 1.4.7.5 1.1 1.3 1.1 2.2 0 1.6-1.3 2.9-2.9 2.9H8.1c-2.5 0-4.5-2-4.5-4.5v-1.3Z",
          stroke: "currentColor",
          strokeWidth: 1.5,
          strokeLinejoin: "round"
        }),
        react.createElement("circle", { cx: 8.6, cy: 11.6, r: 1.05, fill: "currentColor" }),
        react.createElement("path", {
          d: "M12.1 5.4c.8-.9 1.9-1.3 3-1.2-.4.9-.4 1.8-.1 2.6",
          stroke: "currentColor",
          strokeWidth: 1.4,
          strokeLinecap: "round"
        })
      );
    }

    function PanelPage() {
      const [idx, setIdx] = react.useState(0);
      const [alive, setAlive] = react.useState(false);
      const [tries, setTries] = react.useState(0);

      // 页面活着会喊一声，听到就说明这条通了
      react.useEffect(() => {
        function onMsg(e) {
          const d = e && e.data;
          if (d && d.dbf === "alive") setAlive(true);
        }
        window.addEventListener("message", onMsg);
        return function () {
          window.removeEventListener("message", onMsg);
        };
      }, []);

      // 每换一条（或第一次）开始计时：WAIT_MS 内没听到就切下一条
      react.useEffect(() => {
        if (alive) return;
        const t = setTimeout(function () {
          setIdx(function (i) {
            return (i + 1) % SITES.length;
          });
          setTries(function (n) {
            return n + 1;
          });
        }, WAIT_MS);
        return function () {
          clearTimeout(t);
        };
      }, [idx, alive]);

      const site = SITES[idx];
      const host = site.replace("https://", "");

      const bar = react.createElement(
        "div",
        {
          style: {
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 10px",
            fontSize: "11.5px",
            color: alive ? "#2f6bb0" : "#8a7a3d",
            background: alive ? "#eaf3fd" : "#fdf6e3",
            borderBottom: "1px solid rgba(47,107,176,.14)"
          }
        },
        react.createElement("span", null, alive ? "● " + host : "… 正连 " + host),
        alive
          ? null
          : react.createElement(
              "span",
              { style: { opacity: 0.75 } },
              tries > 0 ? "（换过 " + tries + " 次）" : "（8 秒没回声就换另一条）"
            )
      );

      return react.createElement(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "#e9f2fb",
            overflow: "hidden"
          }
        },
        bar,
        react.createElement("iframe", {
          key: idx,
          src: entryOf(site),
          title: "大白饭网络",
          allow: "clipboard-write",
          style: {
            flex: "1 1 auto",
            width: "100%",
            height: "100%",
            border: "0",
            display: "block",
            background: "#e9f2fb"
          }
        })
      );
    }

    function apply(ctx) {
      ctx.slots.inject("sidebar.panellist", () =>
        ctx.slots.register(
          { name: "sidebar.panellist", id: PANEL_ID, order: 60, label: "大白饭网络" },
          WhaleIcon
        )
      );

      ctx.slots.inject("main", function* () {
        yield ctx.slots.register({ name: "main", key: PANEL_ID }, PanelPage);
      });
    }

    exports.apply = apply;
    exports.inject = ["slots"];
    return module.exports;
  }
});
