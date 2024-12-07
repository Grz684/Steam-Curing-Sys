import Bt, { ref as Y, onMounted as ht, provide as xt, readonly as kt, inject as _t, watch as lt, openBlock as be, createElementBlock as we, createElementVNode as k, toDisplayString as je, Fragment as nt, renderList as ot, normalizeClass as tt, createCommentVNode as ct, reactive as bt, createVNode as Ye, withDirectives as pt, vModelRadio as jt, createTextVNode as ft, vModelText as mt, onUnmounted as St, computed as yt, vModelCheckbox as $t, defineComponent as Rt, unref as Ut, normalizeStyle as Dt } from "vue";
const Tt = Symbol(), Lt = Symbol(), At = Symbol();
function Ft(xe, te) {
  xe && xe.messageSignal ? xe.messageSignal.connect((G) => {
    try {
      const i = JSON.parse(G);
      te.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), te.value = { type: "unknown", content: G };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Mt() {
  const xe = Y(null), te = Y(null), G = Y("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      xe.value = d, te.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), Ft(te.value, G), te.value && typeof te.value.vueReady == "function" ? te.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ht(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), xt(Tt, kt(xe)), xt(Lt, kt(te)), xt(At, kt(G));
}
function Je() {
  const xe = _t(Tt), te = _t(Lt), G = _t(At);
  return (!xe || !te || !G) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: xe,
    bridge: te,
    message: G,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), te && te.value)
        if (typeof te.value.sendToPyQt == "function")
          try {
            te.value.sendToPyQt(d, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(te.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const vt = (xe, te) => {
  const G = xe.__vccOpts || xe;
  for (const [i, d] of te)
    G[i] = d;
  return G;
}, Vt = {
  key: 0,
  class: "numeric-keyboard"
}, Wt = { class: "keyboard" }, qt = { class: "current-value" }, zt = ["onClick"], Kt = {
  __name: "NumericKeyboard",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    showKeyboard: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "update:showKeyboard"],
  setup(xe, { emit: te }) {
    const G = xe, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = Y("");
    lt(() => G.showKeyboard, (o) => {
      o && (e.value = G.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => xe.showKeyboard ? (be(), we("div", Vt, [
      k("div", Wt, [
        k("div", qt, je(e.value), 1),
        (be(!0), we(nt, null, ot(d.value, (t) => (be(), we("div", {
          key: t.join(),
          class: "row"
        }, [
          (be(!0), we(nt, null, ot(t, (s) => (be(), we("button", {
            key: s,
            onClick: (u) => n(s),
            class: tt({ "function-key": s === "清除" || s === "确定" })
          }, je(s), 11, zt))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, Ot = /* @__PURE__ */ vt(Kt, [["__scopeId", "data-v-541feda2"]]), Qt = { class: "settings-container" }, Ht = { class: "setting-group" }, Yt = { class: "setting-item" }, Gt = { class: "setting-controls" }, Xt = ["value"], Jt = { class: "setting-item" }, Zt = { class: "setting-controls" }, en = ["value"], tn = { class: "setting-group" }, nn = { class: "setting-item" }, on = { class: "setting-controls" }, rn = ["value"], an = { class: "setting-item" }, sn = { class: "setting-controls" }, un = ["value"], cn = {
  __name: "SensorSettings",
  setup(xe) {
    const { sendToPyQt: te } = Je(), G = bt({
      isPyQtWebEngine: !1
    }), i = Y(35), d = Y(25), e = Y(95), n = Y(90), o = Y(!1), r = Y(null), t = Y("");
    ht(() => {
      if (G.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, G.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: v } = Je();
        lt(v, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const h = JSON.parse(p.content);
              i.value = h.temp_upper, d.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, console.log("Sensor Settings updated:", h);
            } catch (h) {
              console.error("Failed to parse sensor settings data:", h);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const m = JSON.parse(p.content).args;
            i.value = m.temp_upper, d.value = m.temp_lower, e.value = m.humidity_upper, n.value = m.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const s = (v, p) => {
      const h = v === "tempUpper" ? i : v === "tempLower" ? d : v === "humidityUpper" ? e : n;
      h.value = (h.value || 0) + p, v.startsWith("temp") ? u(v === "tempUpper" ? "upper" : "lower") : a(v === "humidityUpper" ? "upper" : "lower");
    }, u = (v) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), v === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), l();
    }, a = (v) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), v === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const v = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", v), G.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), te("updateLimitSettings", v)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (v) => {
      r.value = v, o.value = !0, t.value = v.startsWith("temp") ? v === "tempUpper" ? i.value : d.value : v === "humidityUpper" ? e.value : n.value;
    }, f = (v) => {
      const p = parseFloat(v);
      isNaN(p) || (r.value === "tempUpper" ? (i.value = p, u("upper")) : r.value === "tempLower" ? (d.value = p, u("lower")) : r.value === "humidityUpper" ? (e.value = p, a("upper")) : r.value === "humidityLower" && (n.value = p, a("lower"))), r.value = null;
    };
    return (v, p) => (be(), we("div", Qt, [
      k("div", Ht, [
        p[15] || (p[15] = k("h2", null, "温度设置 (°C)", -1)),
        k("div", Yt, [
          p[13] || (p[13] = k("span", { class: "setting-label" }, "上限：", -1)),
          k("div", Gt, [
            k("button", {
              onClick: p[0] || (p[0] = (h) => s("tempUpper", -1))
            }, "-"),
            k("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (h) => c("tempUpper")),
              readonly: ""
            }, null, 40, Xt),
            k("button", {
              onClick: p[2] || (p[2] = (h) => s("tempUpper", 1))
            }, "+")
          ])
        ]),
        k("div", Jt, [
          p[14] || (p[14] = k("span", { class: "setting-label" }, "下限：", -1)),
          k("div", Zt, [
            k("button", {
              onClick: p[3] || (p[3] = (h) => s("tempLower", -1))
            }, "-"),
            k("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (h) => c("tempLower")),
              readonly: ""
            }, null, 40, en),
            k("button", {
              onClick: p[5] || (p[5] = (h) => s("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      k("div", tn, [
        p[18] || (p[18] = k("h2", null, "湿度设置 (%)", -1)),
        k("div", nn, [
          p[16] || (p[16] = k("span", { class: "setting-label" }, "上限：", -1)),
          k("div", on, [
            k("button", {
              onClick: p[6] || (p[6] = (h) => s("humidityUpper", -1))
            }, "-"),
            k("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (h) => c("humidityUpper")),
              readonly: ""
            }, null, 40, rn),
            k("button", {
              onClick: p[8] || (p[8] = (h) => s("humidityUpper", 1))
            }, "+")
          ])
        ]),
        k("div", an, [
          p[17] || (p[17] = k("span", { class: "setting-label" }, "下限：", -1)),
          k("div", sn, [
            k("button", {
              onClick: p[9] || (p[9] = (h) => s("humidityLower", -1))
            }, "-"),
            k("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (h) => c("humidityLower")),
              readonly: ""
            }, null, 40, un),
            k("button", {
              onClick: p[11] || (p[11] = (h) => s("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Ye(Ot, {
        modelValue: t.value,
        showKeyboard: o.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (h) => o.value = h)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, ln = /* @__PURE__ */ vt(cn, [["__scopeId", "data-v-c66c99de"]]), dn = {
  key: 0,
  class: "numeric-keyboard"
}, fn = { class: "keyboard" }, pn = { class: "current-value" }, vn = ["onClick"], hn = {
  __name: "NumericKeyboardWithNeg",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    showKeyboard: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "update:showKeyboard"],
  setup(xe, { emit: te }) {
    const G = xe, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = Y("");
    lt(() => G.showKeyboard, (o) => {
      o && (e.value = G.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : o === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : o === "." && e.value.includes(".") || (e.value += o);
    };
    return (o, r) => xe.showKeyboard ? (be(), we("div", dn, [
      k("div", fn, [
        k("div", pn, je(e.value), 1),
        (be(!0), we(nt, null, ot(d.value, (t) => (be(), we("div", {
          key: t.join(),
          class: "row"
        }, [
          (be(!0), we(nt, null, ot(t, (s) => (be(), we("button", {
            key: s,
            onClick: (u) => n(s),
            class: tt({
              "function-key": ["清除", "确定"].includes(s),
              "operator-key": s === "-"
            })
          }, je(s), 11, vn))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, mn = /* @__PURE__ */ vt(hn, [["__scopeId", "data-v-3e928534"]]), gn = { class: "sensor-data-group" }, yn = { class: "sensor-section" }, bn = { class: "sensor-container" }, wn = { class: "sensor-grid" }, xn = ["onClick"], kn = { class: "sensor-title" }, _n = { class: "sensor-value" }, Sn = { class: "sensor-section" }, On = { class: "sensor-container" }, En = { class: "sensor-grid" }, jn = ["onClick"], Cn = { class: "sensor-title" }, Tn = { class: "sensor-value" }, Ln = {
  key: 0,
  class: "dialog-overlay"
}, An = { class: "dialog" }, Nn = { class: "dialog-content" }, Pn = { class: "radio-group" }, In = { class: "input-group" }, Bn = ["placeholder"], $n = { class: "dialog-actions" }, Rn = {
  __name: "SensorDisplay",
  setup(xe) {
    const te = Y({ temperature: {}, humidity: {} }), G = Y({
      temperature: {},
      humidity: {}
    }), i = Y(null), d = Y(!1), e = Y("offset"), n = Y(""), o = Y(!1), { sendToPyQt: r } = Je();
    ht(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: c } = Je();
        lt(c, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              te.value = JSON.parse(f.content);
            } catch (v) {
              console.error("Failed to parse sensor data:", v);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const v = JSON.parse(f.content);
              G.value.temperature = v.temperature, G.value.humidity = v.humidity;
            } catch (v) {
              console.error("Failed to parse adjustments data:", v);
            }
          else f && f.type === "get_sensor_data" ? r("update_remote_sensor_data", te.value) : f && f.type === "sensor_debug_mode" && (o.value = JSON.parse(f.content));
        });
      } else
        console.log("在普通网页环境中执行"), t(), setInterval(t, 5e3);
    });
    const t = async () => {
      try {
        const c = await fetch("http://localhost:8000/api/sensor-data/");
        if (!c.ok)
          throw new Error(`HTTP error! status: ${c.status}`);
        const f = await c.json();
        te.value = f;
      } catch (c) {
        console.error("Error fetching sensor data:", c);
      }
    }, s = Y(!1), u = Y(""), a = (c, f) => {
      i.value = f, n.value = c;
      const v = G.value[c][f];
      v ? (e.value = v.type, u.value = String(v.value)) : (e.value = "offset", u.value = ""), d.value = !0, s.value = !1;
    }, l = async () => {
      try {
        const c = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(u.value) || 0
        };
        G.value[n.value] || (G.value[n.value] = {}), G.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(u.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", c), d.value = !1, u.value = "", s.value = !1;
      } catch (c) {
        console.error("Error applying adjustment:", c);
      }
    };
    return (c, f) => (be(), we("div", gn, [
      k("div", yn, [
        f[7] || (f[7] = k("h2", null, "温度传感器", -1)),
        k("div", bn, [
          k("div", wn, [
            (be(!0), we(nt, null, ot(te.value.temperature, (v, p) => (be(), we("div", {
              key: p,
              class: "sensor-card",
              onClick: (h) => o.value ? a("temperature", p) : null
            }, [
              k("div", kn, je(p), 1),
              k("div", _n, je(v), 1)
            ], 8, xn))), 128))
          ])
        ])
      ]),
      k("div", Sn, [
        f[8] || (f[8] = k("h2", null, "湿度传感器", -1)),
        k("div", On, [
          k("div", En, [
            (be(!0), we(nt, null, ot(te.value.humidity, (v, p) => (be(), we("div", {
              key: p,
              class: "sensor-card",
              onClick: (h) => o.value ? a("humidity", p) : null
            }, [
              k("div", Cn, je(p), 1),
              k("div", Tn, je(v), 1)
            ], 8, jn))), 128))
          ])
        ])
      ]),
      d.value ? (be(), we("div", Ln, [
        k("div", An, [
          k("h3", null, "调整传感器: " + je(i.value), 1),
          k("div", Nn, [
            k("div", Pn, [
              k("label", null, [
                pt(k("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (v) => e.value = v),
                  value: "offset"
                }, null, 512), [
                  [jt, e.value]
                ]),
                f[9] || (f[9] = ft(" 调整偏移值 "))
              ]),
              k("label", null, [
                pt(k("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (v) => e.value = v),
                  value: "value"
                }, null, 512), [
                  [jt, e.value]
                ]),
                f[10] || (f[10] = ft(" 直接设置值 "))
              ])
            ]),
            k("div", In, [
              pt(k("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (v) => u.value = v),
                readonly: "",
                onClick: f[3] || (f[3] = (v) => s.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Bn), [
                [mt, u.value]
              ])
            ])
          ]),
          k("div", $n, [
            k("button", {
              onClick: f[4] || (f[4] = (v) => d.value = !1)
            }, "取消"),
            k("button", {
              onClick: l,
              class: "primary"
            }, "确定")
          ])
        ]),
        Ye(mn, {
          modelValue: u.value,
          "onUpdate:modelValue": f[5] || (f[5] = (v) => u.value = v),
          showKeyboard: s.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (v) => s.value = v)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : ct("", !0)
    ]));
  }
}, Un = /* @__PURE__ */ vt(Rn, [["__scopeId", "data-v-af127ef2"]]), Dn = { class: "integrated-control-system" }, Fn = { class: "mode-controls" }, Mn = { class: "btn-group" }, Vn = { class: "btn-group" }, Wn = ["disabled"], qn = ["disabled"], zn = { class: "systems-container" }, Kn = { class: "side-controls" }, Qn = { class: "left-box" }, Hn = { class: "steam_engine" }, Yn = ["disabled"], Gn = { class: "text_status" }, Xn = { class: "right-box" }, Jn = { class: "controls" }, Zn = { class: "input-group" }, eo = ["value"], to = { class: "input-group" }, no = ["value"], oo = { class: "middle-box" }, ro = { class: "state-machine-container" }, io = { class: "state-machine" }, ao = { viewBox: "0 0 800 400" }, so = ["d"], uo = ["x1", "y1", "x2", "y2"], co = ["x", "y"], lo = ["x", "y"], fo = ["x", "y"], po = ["cx", "cy"], vo = ["x", "y"], ho = ["x", "y"], mo = { class: "control-systems" }, go = { class: "control-row" }, yo = { class: "control-item" }, bo = { class: "steam_engine" }, wo = ["disabled"], xo = { class: "control-item" }, ko = { class: "steam_engine" }, _o = ["disabled"], So = { class: "control-item" }, Oo = { class: "steam_engine" }, Eo = ["disabled"], jo = { class: "text_status" }, Ge = 400, Xe = 200, ut = 100, Co = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(xe) {
    const te = Y(!1), G = Y(!1), i = Y(!1), d = Y(!1), e = Y(10), n = Y(0), o = Y(10), r = Y(e.value), t = Y(n.value), s = Y(o.value), u = Y(e.value), a = Y(n.value), l = Y(o.value), c = Y(""), f = Y(0), v = Y(!0), p = Y(!1), h = Y(!1), m = Y(null), y = Y(""), b = Y(!1), { sendToPyQt: O } = Je(), C = Y(0), w = bt({
      isPyQtWebEngine: !1
    }), _ = Y([]);
    let g, S, j;
    const L = xe;
    lt(() => L.message, (le) => {
      le != null && le.content && (v.value ? Z("manual") : Z("auto"));
    });
    const E = Y("S0"), M = Y([
      { x: Ge, y: Xe - ut, label: "S1", text1: "打开全部", text2: "蒸汽机" },
      { x: Ge, y: Xe + ut, label: "S2", text1: "关闭全部蒸汽机", text2: "根据湿度开/关造雾机" }
    ]), V = Y([
      {
        path: `M ${Ge + 80} ${Xe - ut} Q ${Ge + ut} ${Xe} ${Ge + 80} ${Xe + ut}`,
        lineStart: { x: Ge + 40, y: Xe },
        conditionX: Ge + ut + 60,
        conditionY: Xe,
        condition: "C1",
        text1: "平均温度",
        text2: "高于设定的温度上限"
      },
      {
        path: `M ${Ge - 80} ${Xe + ut} Q ${Ge - ut} ${Xe} ${Ge - 80} ${Xe - ut}`,
        lineStart: { x: Ge - 40, y: Xe },
        conditionX: Ge - ut - 60,
        conditionY: Xe,
        condition: "C2",
        text1: "平均温度",
        text2: "低于设定的温度下限"
      }
    ]), J = (le) => {
      le === 1 ? E.value = "S1" : le === 2 && (E.value = "S2");
    };
    ht(() => {
      if (w.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, w.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: le } = Je();
        lt(le, (I) => {
          if (I && I.type === "update_spray_engine_status")
            te.value = I.content;
          else if (I && I.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (I && I.type === "update_left_steam_status")
            G.value = I.content;
          else if (I && I.type === "update_right_steam_status")
            i.value = I.content;
          else if (I && I.type === "update_sprinkler_settings")
            try {
              const X = JSON.parse(I.content);
              u.value = X.sprinkler_single_run_time, a.value = X.sprinkler_run_interval_time, l.value = X.sprinkler_loop_interval, t.value = a.value, r.value = u.value, s.value = l.value, console.log("Sprinkler Settings updated:", X);
            } catch (X) {
              console.error("Failed to parse sprinkler settings data:", X);
            }
          else if (I && I.type === "update_state_machine")
            console.log("Received state machine update:", I.content), J(I.content);
          else if (I && I.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", I.content);
            const X = JSON.parse(I.content);
            X.temperature !== -1 && X.humidity !== -1 ? (T.value = String(X.temperature), A.value = String(X.humidity), b.value = !1) : (b.value = !0, X.temperature === -1 ? T.value = "未知" : T.value = String(X.temperature), X.humidity === -1 ? A.value = "未知" : A.value = String(X.humidity));
          } else if (I && I.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", I.content);
            const Ve = JSON.parse(I.content).args;
            u.value = Ve.sprinkler_single_run_time, a.value = Ve.sprinkler_run_interval_time, l.value = Ve.sprinkler_loop_interval, t.value = a.value, r.value = u.value, s.value = l.value, D();
          } else if (I && I.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", I.content);
            const X = JSON.parse(I.content);
            X.method === "startSystem" ? ne() : X.method === "stopSystem" ? re() : X.method === "setMode" ? Z(X.args.mode) : X.method === "click_toggleEngine" ? Be() : X.method === "click_toggleSteamEngine" ? Re() : X.method === "toggleManualSprinkler" && toggleManualSprinkler(X.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), St(() => {
      clearInterval(j), clearInterval(S), H();
    });
    const ie = (le) => {
      le !== void 0 && clearTimeout(le);
    }, H = () => {
      _.value.forEach((le) => {
        ie(le);
      }), _.value = [];
    }, W = () => {
      const le = {
        leftEngineOn: te.value,
        rightEngineOn: G.value,
        currentSingleRunTime: e.value,
        currentRunIntervalTime: n.value,
        currentLoopInterval: o.value,
        nextSingleRunTime: r.value,
        nextRunIntervalTime: t.value,
        nextLoopInterval: s.value,
        tempSingleRunTime: u.value,
        tempRunIntervalTime: a.value,
        tempLoopInterval: l.value,
        currentPhase: c.value,
        remainingTime: f.value,
        isAutoMode: v.value,
        isRunning: p.value,
        phaseStartTime: C.value
      };
      O("IntegratedControlSystem_init_response", le);
    }, F = yt(() => v.value ? p.value ? c.value === "run" ? `喷淋系统正在运行，剩余 ${f.value + 1} 秒` : c.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : c.value === "loop" ? `循环养护系统工作中，离下次喷淋剩余 ${f.value + 1} 秒` : "" : "喷淋系统未运行" : "手动模式"), T = Y("未知"), A = Y("未知"), Q = yt(() => v.value ? p.value ? c.value === "loop" && b.value === !1 ? `平均温度: ${T.value}°C, 平均湿度: ${A.value}%` : c.value === "loop" && b.value === !0 ? `平均温度: ${T.value}°C, 平均湿度: ${A.value}%, 无法开启循环, 请检查异常传感器` : "循环养护系统未运行" : "循环养护系统未运行" : "手动模式");
    async function Z(le) {
      const I = v.value;
      v.value = le === "auto", I !== v.value && (w.isPyQtWebEngine && (O("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: le } }), O("controlSprinkler", { target: "setMode", mode: v.value ? "auto" : "manual" })), v.value ? (H(), te.value && await U(), G.value && await _e(), i.value && await ve(), d.value && await Le()) : await re());
    }
    async function U() {
      w.isPyQtWebEngine && (O("setEngineState", { engine: "sprayEngine", state: !te.value }), te.value = !te.value);
    }
    async function _e() {
      w.isPyQtWebEngine && (O("setEngineState", { engine: "leftSteamEngine", state: !G.value }), G.value = !G.value);
    }
    async function ve() {
      w.isPyQtWebEngine && (O("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    async function Le() {
      w.isPyQtWebEngine && (O("setEngineState", { engine: "sprinklerEngine", state: !d.value }), d.value = !d.value);
    }
    async function Be() {
      O("IntegratedControlSystem_set_response", { method: "click_toggleSprayEngine", args: {} }), O("setEngineState", { engine: "sprayEngine", state: !te.value }), te.value = !te.value;
    }
    async function Re() {
      w.isPyQtWebEngine && (O("IntegratedControlSystem_set_response", { method: "click_toggleLeftSteamEngine", args: {} }), O("setEngineState", { engine: "leftSteamEngine", state: !G.value }), G.value = !G.value);
    }
    async function Ae() {
      w.isPyQtWebEngine && (O("IntegratedControlSystem_set_response", { method: "click_toggleRightSteamEngine", args: {} }), O("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    async function Ne() {
      w.isPyQtWebEngine && (O("IntegratedControlSystem_set_response", { method: "click_toggleSprinklerEngine", args: {} }), O("setEngineState", { engine: "sprinklerEngine", state: !d.value }), d.value = !d.value);
    }
    function We(le) {
      m.value = le, h.value = !0, y.value = le === "singleRunTime" ? u.value.toString() : le === "runIntervalTime" ? a.value.toString() : l.value.toString();
    }
    function Ze(le) {
      const I = parseInt(le);
      isNaN(I) || (m.value === "singleRunTime" ? (u.value = I, B()) : m.value === "runIntervalTime" ? (a.value = I, $()) : m.value === "loopInterval" && (l.value = I, ee())), m.value = null;
    }
    function B() {
      u.value = Math.max(1, u.value), r.value = u.value, D();
    }
    function $() {
      a.value = Math.max(0, a.value), t.value = a.value, D();
    }
    function ee() {
      l.value = Math.max(0, l.value), s.value = l.value, D();
    }
    function D() {
      if (w.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const le = {
          sprinkler_single_run_time: r.value,
          sprinkler_run_interval_time: t.value,
          sprinkler_loop_interval: s.value
        };
        O("controlSprinkler", { target: "settings", settings: JSON.stringify(le) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function ne() {
      O("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !v.value) && (p.value = !0, await he());
    }
    async function re() {
      O("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), w.isPyQtWebEngine && O("controlSprinkler", { target: "setState", state: !1 }), te.value && await U(), G.value && await _e(), i.value && await ve(), d.value && await Le(), ke();
    }
    function ke() {
      p.value = !1, H(), c.value = "", f.value = 0;
    }
    async function he() {
      Se();
    }
    function se() {
      !p.value || !v.value || (f.value--, f.value > 0 && (g = setTimeout(se, 1e3), _.value.push(g)));
    }
    function Se() {
      !p.value || !v.value || (c.value = "run", e.value = r.value, f.value = e.value, C.value = Date.now(), se(), O("setEngineState", { engine: "sprinklerEngine", state: !0 }), d.value = !0, g = setTimeout(async () => {
        O("setEngineState", { engine: "sprinklerEngine", state: !1 }), d.value = !1, Oe();
      }, e.value * 1e3), _.value.push(g));
    }
    async function Oe() {
      !p.value || !v.value || (o.value = s.value, f.value = o.value, O("controlSprinkler", { target: "setState", state: !0 }), C.value = Date.now(), c.value = "loop", se(), g = setTimeout(async () => {
        O("controlSprinkler", { target: "setState", state: !1 }), te.value && await U(), G.value && await _e(), i.value && await ve(), d.value && await Le(), await he();
      }, o.value * 1e3), _.value.push(g));
    }
    return (le, I) => (be(), we("div", Dn, [
      I[18] || (I[18] = k("h2", null, "集成控制系统【定时喷淋->循环养护->定时喷淋按时间设置交替运行】", -1)),
      I[19] || (I[19] = k("div", { class: "label-box" }, [
        k("label", null, "适用于9传感器+0606数字开关+喷淋小车+两组蒸汽机+超声波造雾机的养护系统"),
        k("br"),
        k("label", null, "在数字开关上，output1控制造雾机开/关，output2控制蒸汽机（组1）开/关，output3控制（组2）蒸汽机开/关，output4连接喷淋小车前进/后退互锁电路，output5控制喷淋水泵1，output6控制喷淋水泵2")
      ], -1)),
      k("div", Fn, [
        k("div", Mn, [
          k("button", {
            onClick: I[0] || (I[0] = (X) => Z("auto")),
            class: tt([{ active: v.value }, "mode-btn"])
          }, "自动模式", 2),
          k("button", {
            onClick: I[1] || (I[1] = (X) => Z("manual")),
            class: tt([{ active: !v.value }, "mode-btn"])
          }, "手动模式", 2)
        ]),
        k("div", Vn, [
          k("button", {
            onClick: ne,
            disabled: p.value || !v.value,
            class: "control-btn"
          }, "开始", 8, Wn),
          k("button", {
            onClick: re,
            disabled: !p.value || !v.value,
            class: "control-btn"
          }, "停止", 8, qn)
        ])
      ]),
      k("div", zn, [
        k("div", Kn, [
          k("div", Qn, [
            I[6] || (I[6] = k("h3", null, "定时喷淋系统", -1)),
            k("div", Hn, [
              k("div", {
                class: tt(["status", { on: d.value }])
              }, [
                I[5] || (I[5] = k("div", { class: "status-indicator" }, null, -1)),
                ft(" " + je(d.value ? "开" : "关"), 1)
              ], 2),
              k("button", {
                onClick: Ne,
                disabled: v.value,
                class: "control-btn"
              }, je(d.value ? "关闭" : "开启"), 9, Yn)
            ]),
            k("div", Gn, je(F.value), 1)
          ]),
          k("div", Xn, [
            I[9] || (I[9] = k("h3", null, "定时喷淋/循环养护系统时间设置", -1)),
            k("div", Jn, [
              k("div", Zn, [
                I[7] || (I[7] = k("label", null, "喷淋系统工作时间 (秒):", -1)),
                k("input", {
                  type: "text",
                  value: u.value,
                  onFocus: I[2] || (I[2] = (X) => We("singleRunTime")),
                  readonly: ""
                }, null, 40, eo)
              ]),
              k("div", to, [
                I[8] || (I[8] = k("label", null, "循环养护系统工作时间 (秒):", -1)),
                k("input", {
                  type: "text",
                  value: l.value,
                  onFocus: I[3] || (I[3] = (X) => We("loopInterval")),
                  readonly: ""
                }, null, 40, no)
              ])
            ])
          ])
        ]),
        k("div", oo, [
          I[17] || (I[17] = k("h3", null, "循环养护系统", -1)),
          k("div", ro, [
            k("div", io, [
              (be(), we("svg", ao, [
                I[10] || (I[10] = k("defs", null, [
                  k("marker", {
                    id: "arrowhead",
                    markerWidth: "10",
                    markerHeight: "7",
                    refX: "9",
                    refY: "3.5",
                    orient: "auto"
                  }, [
                    k("polygon", {
                      points: "0 0, 10 3.5, 0 7",
                      fill: "#2c3e50"
                    })
                  ])
                ], -1)),
                (be(!0), we(nt, null, ot(V.value, (X, Ve) => (be(), we("g", {
                  key: "t" + Ve
                }, [
                  k("path", {
                    d: X.path,
                    class: "transition-path"
                  }, null, 8, so),
                  k("line", {
                    x1: X.lineStart.x,
                    y1: X.lineStart.y,
                    x2: X.conditionX,
                    y2: X.conditionY,
                    class: "condition-line"
                  }, null, 8, uo),
                  k("rect", {
                    x: X.conditionX - 80,
                    y: X.conditionY - 25,
                    width: "160",
                    height: "50",
                    rx: "4",
                    class: "condition-box"
                  }, null, 8, co),
                  k("text", {
                    x: X.conditionX,
                    y: X.conditionY - 8,
                    class: "condition-text"
                  }, je(X.text1), 9, lo),
                  k("text", {
                    x: X.conditionX,
                    y: X.conditionY + 8,
                    class: "condition-text"
                  }, je(X.text2), 9, fo)
                ]))), 128)),
                (be(!0), we(nt, null, ot(M.value, (X, Ve) => (be(), we("g", {
                  key: Ve,
                  class: tt({ active: E.value === X.label })
                }, [
                  k("ellipse", {
                    cx: X.x,
                    cy: X.y,
                    rx: "80",
                    ry: "40",
                    class: tt(["state", { active: E.value === X.label }])
                  }, null, 10, po),
                  k("text", {
                    x: X.x,
                    y: X.y - 8,
                    class: "state-text"
                  }, je(X.text1), 9, vo),
                  k("text", {
                    x: X.x,
                    y: X.y + 8,
                    class: "state-text"
                  }, je(X.text2), 9, ho)
                ], 2))), 128))
              ]))
            ])
          ]),
          k("div", mo, [
            k("div", go, [
              k("div", yo, [
                I[12] || (I[12] = k("h4", null, "蒸汽机（组1）", -1)),
                k("div", bo, [
                  k("div", {
                    class: tt(["status", { on: G.value }])
                  }, [
                    I[11] || (I[11] = k("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + je(G.value ? "开" : "关"), 1)
                  ], 2),
                  k("button", {
                    onClick: Re,
                    disabled: v.value,
                    class: "control-btn"
                  }, je(G.value ? "关闭" : "开启"), 9, wo)
                ])
              ]),
              k("div", xo, [
                I[14] || (I[14] = k("h4", null, "蒸汽机（组2）", -1)),
                k("div", ko, [
                  k("div", {
                    class: tt(["status", { on: i.value }])
                  }, [
                    I[13] || (I[13] = k("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + je(i.value ? "开" : "关"), 1)
                  ], 2),
                  k("button", {
                    onClick: Ae,
                    disabled: v.value,
                    class: "control-btn"
                  }, je(i.value ? "关闭" : "开启"), 9, _o)
                ])
              ]),
              k("div", So, [
                I[16] || (I[16] = k("h4", null, "超声波造雾机", -1)),
                k("div", Oo, [
                  k("div", {
                    class: tt(["status", { on: te.value }])
                  }, [
                    I[15] || (I[15] = k("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + je(te.value ? "开" : "关"), 1)
                  ], 2),
                  k("button", {
                    onClick: Be,
                    disabled: v.value,
                    class: "control-btn"
                  }, je(te.value ? "关闭" : "开启"), 9, Eo)
                ])
              ])
            ])
          ]),
          k("div", jo, je(Q.value), 1)
        ])
      ]),
      Ye(Ot, {
        modelValue: y.value,
        showKeyboard: h.value,
        "onUpdate:modelValue": Ze,
        "onUpdate:showKeyboard": I[4] || (I[4] = (X) => h.value = X)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, To = /* @__PURE__ */ vt(Co, [["__scopeId", "data-v-aaff187a"]]), Lo = { class: "data-actions" }, Ao = {
  key: 0,
  class: "modal-overlay"
}, No = { class: "modal-content settings-modal" }, Po = { class: "setting-group" }, Io = { class: "setting-item" }, Bo = { class: "toggle-switch" }, $o = {
  key: 1,
  class: "modal-overlay"
}, Ro = {
  key: 2,
  class: "modal-overlay"
}, Uo = { class: "modal-content update-modal" }, Do = {
  key: 3,
  class: "modal-overlay"
}, Fo = { class: "modal-content" }, Mo = {
  __name: "DataExport",
  setup(xe) {
    const { sendToPyQt: te } = Je(), G = bt({
      isPyQtWebEngine: !1
    }), i = Y(!1), d = Y(!1), e = Y(""), n = Y(!1), o = Y(!1), r = Y(!1), t = Y(!1), s = Y(""), u = Y(!1), a = Y(!1), l = () => {
      t.value = !0, s.value = "", document.body.style.overflow = "hidden";
    }, c = () => {
      if (!s.value) {
        C("请输入更新版号！");
        return;
      }
      if (!a.value) {
        C("请先连接到互联网！");
        return;
      }
      G.isPyQtWebEngine && te("updateVersion", { version: s.value }), t.value = !1, s.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      t.value = !1, s.value = "", document.body.style.overflow = "auto";
    }, v = () => {
      r.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, p = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, h = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto", G.isPyQtWebEngine && te("saveDebugSettings", { debug_mode: o.value });
    };
    ht(() => {
      if (G.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, G.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: _ } = Je();
        lt(_, (g) => {
          if (g && g.type === "update_debug_mode")
            try {
              const S = JSON.parse(g.content);
              o.value = S.debug_mode, r.value = S.debug_mode;
            } catch (S) {
              console.error("Failed to parse debug settings:", S);
            }
          else if (g && g.type === "DataExport_init") {
            const S = {
              debugMode: o.value
            };
            console.log("Sending initial DataExport state:", S), te("DataExport_init_response", S);
          } else if (g && g.type === "clearData")
            te("exportData", !1), te("clearData_response", "");
          else if (g && g.type === "updateVersion_response")
            try {
              const S = JSON.parse(g.content);
              S.status === "success" ? C(`${S.message}，系统即将重启...`) : C(S.message);
            } catch (S) {
              C("解析更新响应失败：" + S);
            }
          else g && g.type === "wifi_status" && (JSON.parse(g.content).internet_status === "已联网" ? a.value = !0 : a.value = !1);
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const m = () => {
      G.isPyQtWebEngine && (console.log("导出数据"), te("exportData", !0));
    }, y = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, b = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, O = () => {
      console.log("清空数据"), i.value = !1, C("所有数据已清空！"), document.body.style.overflow = "auto", G.isPyQtWebEngine && te("exportData", !1);
    }, C = (_) => {
      e.value = _, d.value = !0;
    }, w = () => {
      d.value = !1;
    };
    return (_, g) => (be(), we("div", Lo, [
      k("div", { class: "action-buttons" }, [
        k("div", { class: "button-group" }, [
          k("button", {
            onClick: m,
            class: "export-btn"
          }, "导出数据")
        ]),
        k("div", { class: "button-group" }, [
          k("button", {
            onClick: y,
            class: "clear-btn"
          }, "清空数据")
        ]),
        k("div", { class: "button-group" }, [
          k("button", {
            onClick: v,
            class: "settings-btn"
          }, "开发者模式")
        ]),
        k("div", { class: "button-group" }, [
          k("button", {
            onClick: l,
            class: "update-btn"
          }, "更新")
        ])
      ]),
      n.value ? (be(), we("div", Ao, [
        k("div", No, [
          k("div", Po, [
            g[7] || (g[7] = k("h2", null, "传感器调试模式【开发者测试用】", -1)),
            k("div", Io, [
              g[6] || (g[6] = k("span", { class: "setting-label" }, "调试模式：", -1)),
              k("div", Bo, [
                pt(k("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": g[0] || (g[0] = (S) => r.value = S)
                }, null, 512), [
                  [$t, r.value]
                ]),
                g[5] || (g[5] = k("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            k("div", { class: "modal-buttons" }, [
              k("button", {
                onClick: h,
                class: "confirm-btn"
              }, "保存"),
              k("button", {
                onClick: p,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : ct("", !0),
      i.value ? (be(), we("div", $o, [
        k("div", { class: "modal-content" }, [
          g[8] || (g[8] = k("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          k("div", { class: "modal-buttons" }, [
            k("button", {
              onClick: O,
              class: "confirm-btn"
            }, "确定"),
            k("button", {
              onClick: b,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      t.value ? (be(), we("div", Ro, [
        k("div", Uo, [
          g[9] || (g[9] = k("h2", null, "更新版本【注意更新时务必全程联网！否则会更新失败】", -1)),
          k("div", {
            class: "update-input",
            onClick: g[2] || (g[2] = (S) => u.value = !0)
          }, [
            pt(k("input", {
              type: "text",
              "onUpdate:modelValue": g[1] || (g[1] = (S) => s.value = S),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [mt, s.value]
            ])
          ]),
          k("div", { class: "modal-buttons" }, [
            k("button", {
              onClick: c,
              class: "confirm-btn"
            }, "更新"),
            k("button", {
              onClick: f,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      Ye(Ot, {
        modelValue: s.value,
        "onUpdate:modelValue": g[3] || (g[3] = (S) => s.value = S),
        "show-keyboard": u.value,
        "onUpdate:showKeyboard": g[4] || (g[4] = (S) => u.value = S)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (be(), we("div", Do, [
        k("div", Fo, [
          k("h2", null, je(e.value), 1),
          k("div", { class: "modal-buttons" }, [
            k("button", {
              onClick: w,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ct("", !0)
    ]));
  }
}, Vo = /* @__PURE__ */ vt(Mo, [["__scopeId", "data-v-59fa8a4f"]]);
var Wo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qo(xe) {
  return xe && xe.__esModule && Object.prototype.hasOwnProperty.call(xe, "default") ? xe.default : xe;
}
var Nt = { exports: {} };
(function(xe, te) {
  (function(G, i) {
    xe.exports = i(Bt);
  })(typeof self < "u" ? self : Wo, function(G) {
    return function(i) {
      var d = {};
      function e(n) {
        if (d[n]) return d[n].exports;
        var o = d[n] = { i: n, l: !1, exports: {} };
        return i[n].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
      }
      return e.m = i, e.c = d, e.d = function(n, o, r) {
        e.o(n, o) || Object.defineProperty(n, o, { enumerable: !0, get: r });
      }, e.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, e.t = function(n, o) {
        if (1 & o && (n = e(n)), 8 & o || 4 & o && typeof n == "object" && n && n.__esModule) return n;
        var r = /* @__PURE__ */ Object.create(null);
        if (e.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: n }), 2 & o && typeof n != "string") for (var t in n) e.d(r, t, (function(s) {
          return n[s];
        }).bind(null, t));
        return r;
      }, e.n = function(n) {
        var o = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return e.d(o, "a", o), o;
      }, e.o = function(n, o) {
        return Object.prototype.hasOwnProperty.call(n, o);
      }, e.p = "", e(e.s = "fb15");
    }({ "00ee": function(i, d, e) {
      var n = e("b622"), o = n("toStringTag"), r = {};
      r[o] = "z", i.exports = String(r) === "[object z]";
    }, "0366": function(i, d, e) {
      var n = e("1c0b");
      i.exports = function(o, r, t) {
        if (n(o), r === void 0) return o;
        switch (t) {
          case 0:
            return function() {
              return o.call(r);
            };
          case 1:
            return function(s) {
              return o.call(r, s);
            };
          case 2:
            return function(s, u) {
              return o.call(r, s, u);
            };
          case 3:
            return function(s, u, a) {
              return o.call(r, s, u, a);
            };
        }
        return function() {
          return o.apply(r, arguments);
        };
      };
    }, "057f": function(i, d, e) {
      var n = e("fc6a"), o = e("241c").f, r = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], s = function(u) {
        try {
          return o(u);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(u) {
        return t && r.call(u) == "[object Window]" ? s(u) : o(n(u));
      };
    }, "06cf": function(i, d, e) {
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), s = e("c04e"), u = e("5135"), a = e("0cfb"), l = Object.getOwnPropertyDescriptor;
      d.f = n ? l : function(c, f) {
        if (c = t(c), f = s(f, !0), a) try {
          return l(c, f);
        } catch {
        }
        if (u(c, f)) return r(!o.f.call(c, f), c[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), s = e("4a7b");
      function u(a) {
        this.defaults = a, this.interceptors = { request: new r(), response: new r() };
      }
      u.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = s(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var l = [t, void 0], c = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(f) {
          l.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          l.push(f.fulfilled, f.rejected);
        }); l.length; ) c = c.then(l.shift(), l.shift());
        return c;
      }, u.prototype.getUri = function(a) {
        return a = s(this.defaults, a), o(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        u.prototype[a] = function(l, c) {
          return this.request(s(c || {}, { method: a, url: l, data: (c || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        u.prototype[a] = function(l, c, f) {
          return this.request(s(f || {}, { method: a, url: l, data: c }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, s = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, a, l, c, f, v) {
        var p = l + u.length, h = c.length, m = s;
        return f !== void 0 && (f = n(f), m = t), r.call(v, m, function(y, b) {
          var O;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return a.slice(0, l);
            case "'":
              return a.slice(p);
            case "<":
              O = f[b.slice(1, -1)];
              break;
            default:
              var C = +b;
              if (C === 0) return y;
              if (C > h) {
                var w = o(C / 10);
                return w === 0 ? y : w <= h ? c[w - 1] === void 0 ? b.charAt(1) : c[w - 1] + b.charAt(1) : y;
              }
              O = c[C - 1];
          }
          return O === void 0 ? "" : O;
        });
      };
    }, "0cfb": function(i, d, e) {
      var n = e("83ab"), o = e("d039"), r = e("cc12");
      i.exports = !n && !o(function() {
        return Object.defineProperty(r("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(i, d, e) {
      i.exports = function(n) {
        return function(o) {
          return n.apply(null, o);
        };
      };
    }, 1148: function(i, d, e) {
      var n = e("a691"), o = e("1d80");
      i.exports = "".repeat || function(r) {
        var t = String(o(this)), s = "", u = n(r);
        if (u < 0 || u == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (t += t)) 1 & u && (s += t);
        return s;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), s = e("4840"), u = e("8aa5"), a = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), v = [].push, p = Math.min, h = 4294967295, m = !f(function() {
        return !RegExp(h, "y");
      });
      n("split", 2, function(y, b, O) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(w, _) {
          var g = String(t(this)), S = _ === void 0 ? h : _ >>> 0;
          if (S === 0) return [];
          if (w === void 0) return [g];
          if (!o(w)) return b.call(g, w, S);
          for (var j, L, E, M = [], V = (w.ignoreCase ? "i" : "") + (w.multiline ? "m" : "") + (w.unicode ? "u" : "") + (w.sticky ? "y" : ""), J = 0, ie = new RegExp(w.source, V + "g"); (j = c.call(ie, g)) && (L = ie.lastIndex, !(L > J && (M.push(g.slice(J, j.index)), j.length > 1 && j.index < g.length && v.apply(M, j.slice(1)), E = j[0].length, J = L, M.length >= S))); )
            ie.lastIndex === j.index && ie.lastIndex++;
          return J === g.length ? !E && ie.test("") || M.push("") : M.push(g.slice(J)), M.length > S ? M.slice(0, S) : M;
        } : "0".split(void 0, 0).length ? function(w, _) {
          return w === void 0 && _ === 0 ? [] : b.call(this, w, _);
        } : b, [function(w, _) {
          var g = t(this), S = w == null ? void 0 : w[y];
          return S !== void 0 ? S.call(w, g, _) : C.call(String(g), w, _);
        }, function(w, _) {
          var g = O(C, w, this, _, C !== b);
          if (g.done) return g.value;
          var S = r(w), j = String(this), L = s(S, RegExp), E = S.unicode, M = (S.ignoreCase ? "i" : "") + (S.multiline ? "m" : "") + (S.unicode ? "u" : "") + (m ? "y" : "g"), V = new L(m ? S : "^(?:" + S.source + ")", M), J = _ === void 0 ? h : _ >>> 0;
          if (J === 0) return [];
          if (j.length === 0) return l(V, j) === null ? [j] : [];
          for (var ie = 0, H = 0, W = []; H < j.length; ) {
            V.lastIndex = m ? H : 0;
            var F, T = l(V, m ? j : j.slice(H));
            if (T === null || (F = p(a(V.lastIndex + (m ? 0 : H)), j.length)) === ie) H = u(j, H, E);
            else {
              if (W.push(j.slice(ie, H)), W.length === J) return W;
              for (var A = 1; A <= T.length - 1; A++) if (W.push(T[A]), W.length === J) return W;
              H = ie = F;
            }
          }
          return W.push(j.slice(ie)), W;
        }];
      }, !m);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), s = e("605d"), u = r("reduce"), a = !s && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || a }, { reduce: function(l) {
        return o(this, l, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, d, e) {
      var n = e("c6b6"), o = e("9263");
      i.exports = function(r, t) {
        var s = r.exec;
        if (typeof s == "function") {
          var u = s.call(r, t);
          if (typeof u != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return u;
        }
        if (n(r) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return o.call(r, t);
      };
    }, "159b": function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("17c2"), t = e("9112");
      for (var s in o) {
        var u = n[s], a = u && u.prototype;
        if (a && a.forEach !== r) try {
          t(a, "forEach", r);
        } catch {
          a.forEach = r;
        }
      }
    }, "17c2": function(i, d, e) {
      var n = e("b727").forEach, o = e("a640"), r = o("forEach");
      i.exports = r ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(i, d) {
      i.exports = function(e, n, o) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (o ? o + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(i, d, e) {
      var n = e("d066");
      i.exports = n("document", "documentElement");
    }, "1c0b": function(i, d) {
      i.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(i, d, e) {
      var n = e("b622"), o = n("iterator"), r = !1;
      try {
        var t = 0, s = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          r = !0;
        } };
        s[o] = function() {
          return this;
        }, Array.from(s, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(u, a) {
        if (!a && !r) return !1;
        var l = !1;
        try {
          var c = {};
          c[o] = function() {
            return { next: function() {
              return { done: l = !0 };
            } };
          }, u(c);
        } catch {
        }
        return l;
      };
    }, "1cdc": function(i, d, e) {
      var n = e("342f");
      i.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(i, d, e) {
      i.exports = function(n, o) {
        return function() {
          for (var r = new Array(arguments.length), t = 0; t < r.length; t++) r[t] = arguments[t];
          return n.apply(o, r);
        };
      };
    }, "1d80": function(i, d) {
      i.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(i, d, e) {
      var n = e("d039"), o = e("b622"), r = e("2d00"), t = o("species");
      i.exports = function(s) {
        return r >= 51 || !n(function() {
          var u = [], a = u.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, u[s](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          function o(B, $) {
            return $ = { exports: {} }, B($, $.exports), $.exports;
          }
          var r = o(function(B, $) {
            (function(ee, D) {
              B.exports = D();
            })(0, function() {
              function ee(se) {
                var Se = se && typeof se == "object";
                return Se && Object.prototype.toString.call(se) !== "[object RegExp]" && Object.prototype.toString.call(se) !== "[object Date]";
              }
              function D(se) {
                return Array.isArray(se) ? [] : {};
              }
              function ne(se, Se) {
                var Oe = Se && Se.clone === !0;
                return Oe && ee(se) ? he(D(se), se, Se) : se;
              }
              function re(se, Se, Oe) {
                var le = se.slice();
                return Se.forEach(function(I, X) {
                  typeof le[X] > "u" ? le[X] = ne(I, Oe) : ee(I) ? le[X] = he(se[X], I, Oe) : se.indexOf(I) === -1 && le.push(ne(I, Oe));
                }), le;
              }
              function ke(se, Se, Oe) {
                var le = {};
                return ee(se) && Object.keys(se).forEach(function(I) {
                  le[I] = ne(se[I], Oe);
                }), Object.keys(Se).forEach(function(I) {
                  ee(Se[I]) && se[I] ? le[I] = he(se[I], Se[I], Oe) : le[I] = ne(Se[I], Oe);
                }), le;
              }
              function he(se, Se, Oe) {
                var le = Array.isArray(Se), I = Oe || { arrayMerge: re }, X = I.arrayMerge || re;
                return le ? Array.isArray(se) ? X(se, Se, Oe) : ne(Se, Oe) : ke(se, Se, Oe);
              }
              return he.all = function(se, Se) {
                if (!Array.isArray(se) || se.length < 2) throw new Error("first argument should be an array with at least two elements");
                return se.reduce(function(Oe, le) {
                  return he(Oe, le, Se);
                });
              }, he;
            });
          });
          function t(B) {
            return B = B || /* @__PURE__ */ Object.create(null), { on: function($, ee) {
              (B[$] || (B[$] = [])).push(ee);
            }, off: function($, ee) {
              B[$] && B[$].splice(B[$].indexOf(ee) >>> 0, 1);
            }, emit: function($, ee) {
              (B[$] || []).map(function(D) {
                D(ee);
              }), (B["*"] || []).map(function(D) {
                D($, ee);
              });
            } };
          }
          var s = o(function(B, $) {
            var ee = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            $.default = ee, B.exports = $.default;
          }), u = function(B) {
            return Object.keys(B).map(function($) {
              var ee = B[$].toString().replace(/"/g, "&quot;");
              return $ + '="' + ee + '"';
            }).join(" ");
          }, a = s.svg, l = s.xlink, c = {};
          c[a.name] = a.uri, c[l.name] = l.uri;
          var f, v = function(B, $) {
            B === void 0 && (B = "");
            var ee = r(c, $ || {}), D = u(ee);
            return "<svg " + D + ">" + B + "</svg>";
          }, p = s.svg, h = s.xlink, m = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[h.name] = h.uri, f) }, y = function(B) {
            this.config = r(m, B || {}), this.symbols = [];
          };
          y.prototype.add = function(B) {
            var $ = this, ee = $.symbols, D = this.find(B.id);
            return D ? (ee[ee.indexOf(D)] = B, !1) : (ee.push(B), !0);
          }, y.prototype.remove = function(B) {
            var $ = this, ee = $.symbols, D = this.find(B);
            return !!D && (ee.splice(ee.indexOf(D), 1), D.destroy(), !0);
          }, y.prototype.find = function(B) {
            return this.symbols.filter(function($) {
              return $.id === B;
            })[0] || null;
          }, y.prototype.has = function(B) {
            return this.find(B) !== null;
          }, y.prototype.stringify = function() {
            var B = this.config, $ = B.attrs, ee = this.symbols.map(function(D) {
              return D.stringify();
            }).join("");
            return v(ee, $);
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var b = function(B) {
            var $ = B.id, ee = B.viewBox, D = B.content;
            this.id = $, this.viewBox = ee, this.content = D;
          };
          b.prototype.stringify = function() {
            return this.content;
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            var B = this;
            ["id", "viewBox", "content"].forEach(function($) {
              return delete B[$];
            });
          };
          var O = function(B) {
            var $ = !!document.importNode, ee = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return $ ? document.importNode(ee, !0) : ee;
          }, C = function(B) {
            function $() {
              B.apply(this, arguments);
            }
            B && ($.__proto__ = B), $.prototype = Object.create(B && B.prototype), $.prototype.constructor = $;
            var ee = { isMounted: {} };
            return ee.isMounted.get = function() {
              return !!this.node;
            }, $.createFromExistingNode = function(D) {
              return new $({ id: D.getAttribute("id"), viewBox: D.getAttribute("viewBox"), content: D.outerHTML });
            }, $.prototype.destroy = function() {
              this.isMounted && this.unmount(), B.prototype.destroy.call(this);
            }, $.prototype.mount = function(D) {
              if (this.isMounted) return this.node;
              var ne = typeof D == "string" ? document.querySelector(D) : D, re = this.render();
              return this.node = re, ne.appendChild(re), re;
            }, $.prototype.render = function() {
              var D = this.stringify();
              return O(v(D)).childNodes[0];
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties($.prototype, ee), $;
          }(b), w = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, _ = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, g = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, S = function(B, $) {
            var ee = document.createEvent("CustomEvent");
            ee.initCustomEvent(B, !1, !1, $), window.dispatchEvent(ee);
          }, j = function(B) {
            var $ = [];
            return _(B.querySelectorAll("style")).forEach(function(ee) {
              ee.textContent += "", $.push(ee);
            }), $;
          }, L = function(B) {
            return (B || window.location.href).split("#")[0];
          }, E = function(B) {
            angular.module("ng").run(["$rootScope", function($) {
              $.$on("$locationChangeSuccess", function(ee, D, ne) {
                S(B, { oldUrl: ne, newUrl: D });
              });
            }]);
          }, M = "linearGradient, radialGradient, pattern, mask, clipPath", V = function(B, $) {
            return $ === void 0 && ($ = M), _(B.querySelectorAll("symbol")).forEach(function(ee) {
              _(ee.querySelectorAll($)).forEach(function(D) {
                ee.parentNode.insertBefore(D, ee);
              });
            }), B;
          };
          function J(B, $) {
            var ee = _(B).reduce(function(D, ne) {
              if (!ne.attributes) return D;
              var re = _(ne.attributes), ke = $ ? re.filter($) : re;
              return D.concat(ke);
            }, []);
            return ee;
          }
          var ie = s.xlink.uri, H = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function F(B) {
            return B.replace(W, function($) {
              return "%" + $[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function T(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A(B, $, ee) {
            return _(B).forEach(function(D) {
              var ne = D.getAttribute(H);
              if (ne && ne.indexOf($) === 0) {
                var re = ne.replace($, ee);
                D.setAttributeNS(ie, H, re);
              }
            }), B;
          }
          var Q, Z = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = Z.map(function(B) {
            return "[" + B + "]";
          }).join(","), _e = function(B, $, ee, D) {
            var ne = F(ee), re = F(D), ke = B.querySelectorAll(U), he = J(ke, function(se) {
              var Se = se.localName, Oe = se.value;
              return Z.indexOf(Se) !== -1 && Oe.indexOf("url(" + ne) !== -1;
            });
            he.forEach(function(se) {
              return se.value = se.value.replace(new RegExp(T(ne), "g"), re);
            }), A($, ne, re);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Le = function(B) {
            function $(D) {
              var ne = this;
              D === void 0 && (D = {}), B.call(this, r(w, D));
              var re = t();
              this._emitter = re, this.node = null;
              var ke = this, he = ke.config;
              if (he.autoConfigure && this._autoConfigure(D), he.syncUrlsWithBaseTag) {
                var se = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(ve.MOUNT, function() {
                  return ne.updateUrls("#", se);
                });
              }
              var Se = this._handleLocationChange.bind(this);
              this._handleLocationChange = Se, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, Se), he.locationChangeAngularEmitter && E(he.locationChangeEvent), re.on(ve.MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && V(Oe);
              }), re.on(ve.SYMBOL_MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && V(Oe.parentNode), (g.isIE() || g.isEdge()) && j(Oe);
              });
            }
            B && ($.__proto__ = B), $.prototype = Object.create(B && B.prototype), $.prototype.constructor = $;
            var ee = { isMounted: {} };
            return ee.isMounted.get = function() {
              return !!this.node;
            }, $.prototype._autoConfigure = function(D) {
              var ne = this, re = ne.config;
              typeof D.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof D.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof D.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = g.isFirefox());
            }, $.prototype._handleLocationChange = function(D) {
              var ne = D.detail, re = ne.oldUrl, ke = ne.newUrl;
              this.updateUrls(re, ke);
            }, $.prototype.add = function(D) {
              var ne = this, re = B.prototype.add.call(this, D);
              return this.isMounted && re && (D.mount(ne.node), this._emitter.emit(ve.SYMBOL_MOUNT, D.node)), re;
            }, $.prototype.attach = function(D) {
              var ne = this, re = this;
              if (re.isMounted) return re.node;
              var ke = typeof D == "string" ? document.querySelector(D) : D;
              return re.node = ke, this.symbols.forEach(function(he) {
                he.mount(re.node), ne._emitter.emit(ve.SYMBOL_MOUNT, he.node);
              }), _(ke.querySelectorAll("symbol")).forEach(function(he) {
                var se = C.createFromExistingNode(he);
                se.node = he, re.add(se);
              }), this._emitter.emit(ve.MOUNT, ke), ke;
            }, $.prototype.destroy = function() {
              var D = this, ne = D.config, re = D.symbols, ke = D._emitter;
              re.forEach(function(he) {
                return he.destroy();
              }), ke.off("*"), window.removeEventListener(ne.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, $.prototype.mount = function(D, ne) {
              D === void 0 && (D = this.config.mountTo), ne === void 0 && (ne = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var ke = typeof D == "string" ? document.querySelector(D) : D, he = re.render();
              return this.node = he, ne && ke.childNodes[0] ? ke.insertBefore(he, ke.childNodes[0]) : ke.appendChild(he), this._emitter.emit(ve.MOUNT, he), he;
            }, $.prototype.render = function() {
              return O(this.stringify());
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, $.prototype.updateUrls = function(D, ne) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return _e(this.node, re, L(D) + "#", L(ne) + "#"), !0;
            }, Object.defineProperties($.prototype, ee), $;
          }(y), Be = o(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function($, ee) {
              B.exports = ee();
            })(0, function() {
              var $, ee = [], D = document, ne = D.documentElement.doScroll, re = "DOMContentLoaded", ke = (ne ? /^loaded|^c/ : /^loaded|^i|^c/).test(D.readyState);
              return ke || D.addEventListener(re, $ = function() {
                for (D.removeEventListener(re, $), ke = 1; $ = ee.shift(); ) $();
              }), function(he) {
                ke ? setTimeout(he, 0) : ee.push(he);
              };
            });
          }), Re = "__SVG_SPRITE_NODE__", Ae = "__SVG_SPRITE__", Ne = !!window[Ae];
          Ne ? Q = window[Ae] : (Q = new Le({ attrs: { id: Re, "aria-hidden": "true" } }), window[Ae] = Q);
          var We = function() {
            var B = document.getElementById(Re);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? We() : Be(We);
          var Ze = Q;
          return Ze;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), s = e("35a1"), u = e("2a62"), a = function(l, c) {
        this.stopped = l, this.result = c;
      };
      i.exports = function(l, c, f) {
        var v, p, h, m, y, b, O, C = f && f.that, w = !(!f || !f.AS_ENTRIES), _ = !(!f || !f.IS_ITERATOR), g = !(!f || !f.INTERRUPTED), S = t(c, C, 1 + w + g), j = function(E) {
          return v && u(v), new a(!0, E);
        }, L = function(E) {
          return w ? (n(E), g ? S(E[0], E[1], j) : S(E[0], E[1])) : g ? S(E, j) : S(E);
        };
        if (_) v = l;
        else {
          if (p = s(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (o(p)) {
            for (h = 0, m = r(l.length); m > h; h++) if (y = L(l[h]), y && y instanceof a) return y;
            return new a(!1);
          }
          v = p.call(l);
        }
        for (b = v.next; !(O = b.call(v)).done; ) {
          try {
            y = L(O.value);
          } catch (E) {
            throw u(v), E;
          }
          if (typeof y == "object" && y && y instanceof a) return y;
        }
        return new a(!1);
      };
    }, "23cb": function(i, d, e) {
      var n = e("a691"), o = Math.max, r = Math.min;
      i.exports = function(t, s) {
        var u = n(t);
        return u < 0 ? o(u + s, 0) : r(u, s);
      };
    }, "23e7": function(i, d, e) {
      var n = e("da84"), o = e("06cf").f, r = e("9112"), t = e("6eeb"), s = e("ce4e"), u = e("e893"), a = e("94ca");
      i.exports = function(l, c) {
        var f, v, p, h, m, y, b = l.target, O = l.global, C = l.stat;
        if (v = O ? n : C ? n[b] || s(b, {}) : (n[b] || {}).prototype, v) for (p in c) {
          if (m = c[p], l.noTargetGet ? (y = o(v, p), h = y && y.value) : h = v[p], f = a(O ? p : b + (C ? "." : "#") + p, l.forced), !f && h !== void 0) {
            if (typeof m == typeof h) continue;
            u(m, h);
          }
          (l.sham || h && h.sham) && r(m, "sham", !0), t(v, p, m, l);
        }
      };
    }, "241c": function(i, d, e) {
      var n = e("ca84"), o = e("7839"), r = o.concat("length", "prototype");
      d.f = Object.getOwnPropertyNames || function(t) {
        return n(t, r);
      };
    }, 2444: function(i, d, e) {
      (function(n) {
        var o = e("c532"), r = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function s(l, c) {
          !o.isUndefined(l) && o.isUndefined(l["Content-Type"]) && (l["Content-Type"] = c);
        }
        function u() {
          var l;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (l = e("b50d")), l;
        }
        var a = { adapter: u(), transformRequest: [function(l, c) {
          return r(c, "Accept"), r(c, "Content-Type"), o.isFormData(l) || o.isArrayBuffer(l) || o.isBuffer(l) || o.isStream(l) || o.isFile(l) || o.isBlob(l) ? l : o.isArrayBufferView(l) ? l.buffer : o.isURLSearchParams(l) ? (s(c, "application/x-www-form-urlencoded;charset=utf-8"), l.toString()) : o.isObject(l) ? (s(c, "application/json;charset=utf-8"), JSON.stringify(l)) : l;
        }], transformResponse: [function(l) {
          if (typeof l == "string") try {
            l = JSON.parse(l);
          } catch {
          }
          return l;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(l) {
          return l >= 200 && l < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        o.forEach(["delete", "get", "head"], function(l) {
          a.headers[l] = {};
        }), o.forEach(["post", "put", "patch"], function(l) {
          a.headers[l] = o.merge(t);
        }), i.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(s) {
        return !!~String(r(this)).indexOf(o(s), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), s = "toString", u = RegExp.prototype, a = u[s], l = r(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), c = a.name != s;
      (l || c) && n(RegExp.prototype, s, function() {
        var f = o(this), v = String(f.source), p = f.flags, h = String(p === void 0 && f instanceof RegExp && !("flags" in u) ? t.call(f) : p);
        return "/" + v + "/" + h;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), s = r("species");
      i.exports = function(u) {
        var a = n(u), l = o.f;
        t && a && !a[s] && l(a, s, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(i, d, e) {
      var n = e("825a");
      i.exports = function(o) {
        var r = o.return;
        if (r !== void 0) return n(r.call(o)).value;
      };
    }, "2cf4": function(i, d, e) {
      var n, o, r, t = e("da84"), s = e("d039"), u = e("0366"), a = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), v = t.location, p = t.setImmediate, h = t.clearImmediate, m = t.process, y = t.MessageChannel, b = t.Dispatch, O = 0, C = {}, w = "onreadystatechange", _ = function(L) {
        if (C.hasOwnProperty(L)) {
          var E = C[L];
          delete C[L], E();
        }
      }, g = function(L) {
        return function() {
          _(L);
        };
      }, S = function(L) {
        _(L.data);
      }, j = function(L) {
        t.postMessage(L + "", v.protocol + "//" + v.host);
      };
      p && h || (p = function(L) {
        for (var E = [], M = 1; arguments.length > M; ) E.push(arguments[M++]);
        return C[++O] = function() {
          (typeof L == "function" ? L : Function(L)).apply(void 0, E);
        }, n(O), O;
      }, h = function(L) {
        delete C[L];
      }, f ? n = function(L) {
        m.nextTick(g(L));
      } : b && b.now ? n = function(L) {
        b.now(g(L));
      } : y && !c ? (o = new y(), r = o.port2, o.port1.onmessage = S, n = u(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && v && v.protocol !== "file:" && !s(j) ? (n = j, t.addEventListener("message", S, !1)) : n = w in l("script") ? function(L) {
        a.appendChild(l("script"))[w] = function() {
          a.removeChild(this), _(L);
        };
      } : function(L) {
        setTimeout(g(L), 0);
      }), i.exports = { set: p, clear: h };
    }, "2d00": function(i, d, e) {
      var n, o, r = e("da84"), t = e("342f"), s = r.process, u = s && s.versions, a = u && u.v8;
      a ? (n = a.split("."), o = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (o = n[1]))), i.exports = o && +o;
    }, "2d83": function(i, d, e) {
      var n = e("387f");
      i.exports = function(o, r, t, s, u) {
        var a = new Error(o);
        return n(a, r, t, s, u);
      };
    }, "2e67": function(i, d, e) {
      i.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(i, d, e) {
      var n = e("c532");
      function o(r) {
        return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      i.exports = function(r, t, s) {
        if (!t) return r;
        var u;
        if (s) u = s(t);
        else if (n.isURLSearchParams(t)) u = t.toString();
        else {
          var a = [];
          n.forEach(t, function(c, f) {
            c !== null && typeof c < "u" && (n.isArray(c) ? f += "[]" : c = [c], n.forEach(c, function(v) {
              n.isDate(v) ? v = v.toISOString() : n.isObject(v) && (v = JSON.stringify(v)), a.push(o(f) + "=" + o(v));
            }));
          }), u = a.join("&");
        }
        if (u) {
          var l = r.indexOf("#");
          l !== -1 && (r = r.slice(0, l)), r += (r.indexOf("?") === -1 ? "?" : "&") + u;
        }
        return r;
      };
    }, "342f": function(i, d, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, d, e) {
      var n = e("f5df"), o = e("3f8c"), r = e("b622"), t = r("iterator");
      i.exports = function(s) {
        if (s != null) return s[t] || s["@@iterator"] || o[n(s)];
      };
    }, "37e8": function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(s, u) {
        r(s);
        for (var a, l = t(u), c = l.length, f = 0; c > f; ) o.f(s, a = l[f++], u[a]);
        return s;
      };
    }, "387f": function(i, d, e) {
      i.exports = function(n, o, r, t, s) {
        return n.config = o, r && (n.code = r), n.request = t, n.response = s, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, d, e) {
      e("acce");
    }, 3934: function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var o, r = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function s(u) {
          var a = u;
          return r && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return o = s(window.location.href), function(u) {
          var a = n.isString(u) ? s(u) : u;
          return a.protocol === o.protocol && a.host === o.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(i, d, e) {
      var n = e("861d");
      i.exports = function(o) {
        if (!n(o) && o !== null) throw TypeError("Can't set " + String(o) + " as a prototype");
        return o;
      };
    }, "3ca3": function(i, d, e) {
      var n = e("6547").charAt, o = e("69f3"), r = e("7dd0"), t = "String Iterator", s = o.set, u = o.getterFor(t);
      r(String, "String", function(a) {
        s(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, l = u(this), c = l.string, f = l.index;
        return f >= c.length ? { value: void 0, done: !0 } : (a = n(c, f), l.index += a.length, { value: a, done: !1 });
      });
    }, "3f8c": function(i, d) {
      i.exports = {};
    }, "408a": function(i, d, e) {
      var n = e("c6b6");
      i.exports = function(o) {
        if (typeof o != "number" && n(o) != "Number") throw TypeError("Incorrect invocation");
        return +o;
      };
    }, "428f": function(i, d, e) {
      var n = e("da84");
      i.exports = n;
    }, 4362: function(i, d, e) {
      d.nextTick = function(n) {
        var o = Array.prototype.slice.call(arguments);
        o.shift(), setTimeout(function() {
          n.apply(null, o);
        }, 0);
      }, d.platform = d.arch = d.execPath = d.title = "browser", d.pid = 1, d.browser = !0, d.env = {}, d.argv = [], d.binding = function(n) {
        throw new Error("No such module. (Possibly not yet loaded)");
      }, function() {
        var n, o = "/";
        d.cwd = function() {
          return o;
        }, d.chdir = function(r) {
          n || (n = e("df7c")), o = n.resolve(r, o);
        };
      }(), d.exit = d.kill = d.umask = d.dlopen = d.uptime = d.memoryUsage = d.uvCounters = function() {
      }, d.features = {};
    }, "44ad": function(i, d, e) {
      var n = e("d039"), o = e("c6b6"), r = "".split;
      i.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return o(t) == "String" ? r.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(i, d, e) {
      var n = e("b622"), o = e("7c73"), r = e("9bf2"), t = n("unscopables"), s = Array.prototype;
      s[t] == null && r.f(s, t, { configurable: !0, value: o(null) }), i.exports = function(u) {
        s[t][u] = !0;
      };
    }, "44de": function(i, d, e) {
      var n = e("da84");
      i.exports = function(o, r) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(o) : t.error(o, r));
      };
    }, "44e7": function(i, d, e) {
      var n = e("861d"), o = e("c6b6"), r = e("b622"), t = r("match");
      i.exports = function(s) {
        var u;
        return n(s) && ((u = s[t]) !== void 0 ? !!u : o(s) == "RegExp");
      };
    }, "466d": function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("1d80"), s = e("8aa5"), u = e("14c3");
      n("match", 1, function(a, l, c) {
        return [function(f) {
          var v = t(this), p = f == null ? void 0 : f[a];
          return p !== void 0 ? p.call(f, v) : new RegExp(f)[a](String(v));
        }, function(f) {
          var v = c(l, f, this);
          if (v.done) return v.value;
          var p = o(f), h = String(this);
          if (!p.global) return u(p, h);
          var m = p.unicode;
          p.lastIndex = 0;
          for (var y, b = [], O = 0; (y = u(p, h)) !== null; ) {
            var C = String(y[0]);
            b[O] = C, C === "" && (p.lastIndex = s(h, r(p.lastIndex), m)), O++;
          }
          return O === 0 ? null : b;
        }];
      });
    }, "467f": function(i, d, e) {
      var n = e("2d83");
      i.exports = function(o, r, t) {
        var s = t.config.validateStatus;
        t.status && s && !s(t.status) ? r(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : o(t);
      };
    }, 4840: function(i, d, e) {
      var n = e("825a"), o = e("1c0b"), r = e("b622"), t = r("species");
      i.exports = function(s, u) {
        var a, l = n(s).constructor;
        return l === void 0 || (a = n(l)[t]) == null ? u : o(a);
      };
    }, 4930: function(i, d, e) {
      var n = e("605d"), o = e("2d00"), r = e("d039");
      i.exports = !!Object.getOwnPropertySymbols && !r(function() {
        return !Symbol.sham && (n ? o === 38 : o > 37 && o < 41);
      });
    }, "4a7b": function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r) {
        r = r || {};
        var t = {}, s = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], l = ["validateStatus"];
        function c(h, m) {
          return n.isPlainObject(h) && n.isPlainObject(m) ? n.merge(h, m) : n.isPlainObject(m) ? n.merge({}, m) : n.isArray(m) ? m.slice() : m;
        }
        function f(h) {
          n.isUndefined(r[h]) ? n.isUndefined(o[h]) || (t[h] = c(void 0, o[h])) : t[h] = c(o[h], r[h]);
        }
        n.forEach(s, function(h) {
          n.isUndefined(r[h]) || (t[h] = c(void 0, r[h]));
        }), n.forEach(u, f), n.forEach(a, function(h) {
          n.isUndefined(r[h]) ? n.isUndefined(o[h]) || (t[h] = c(void 0, o[h])) : t[h] = c(void 0, r[h]);
        }), n.forEach(l, function(h) {
          h in r ? t[h] = c(o[h], r[h]) : h in o && (t[h] = c(void 0, o[h]));
        });
        var v = s.concat(u).concat(a).concat(l), p = Object.keys(o).concat(Object.keys(r)).filter(function(h) {
          return v.indexOf(h) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), s = e("9bf2").f, u = e("241c").f, a = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), v = e("d039"), p = e("69f3").set, h = e("2626"), m = e("b622"), y = m("match"), b = o.RegExp, O = b.prototype, C = /a/g, w = /a/g, _ = new b(C) !== C, g = c.UNSUPPORTED_Y, S = n && r("RegExp", !_ || g || v(function() {
        return w[y] = !1, b(C) != C || b(w) == w || b(C, "i") != "/a/i";
      }));
      if (S) {
        for (var j = function(V, J) {
          var ie, H = this instanceof j, W = a(V), F = J === void 0;
          if (!H && W && V.constructor === j && F) return V;
          _ ? W && !F && (V = V.source) : V instanceof j && (F && (J = l.call(V)), V = V.source), g && (ie = !!J && J.indexOf("y") > -1, ie && (J = J.replace(/y/g, "")));
          var T = t(_ ? new b(V, J) : b(V, J), H ? this : O, j);
          return g && ie && p(T, { sticky: ie }), T;
        }, L = function(V) {
          V in j || s(j, V, { configurable: !0, get: function() {
            return b[V];
          }, set: function(J) {
            b[V] = J;
          } });
        }, E = u(b), M = 0; E.length > M; ) L(E[M++]);
        O.constructor = j, j.prototype = O, f(o, "RegExp", j);
      }
      h("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(s) {
        return function(u, a, l) {
          var c, f = n(u), v = o(f.length), p = r(l, v);
          if (s && a != a) {
            for (; v > p; ) if (c = f[p++], c != c) return !0;
          } else for (; v > p; p++) if ((s || p in f) && f[p] === a) return s || p || 0;
          return !s && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, d, e) {
      var n = e("23e7"), o = e("b727").filter, r = e("1dde"), t = r("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(s) {
        return o(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, d, e) {
      var n = e("0366"), o = e("7b0b"), r = e("9bdd"), t = e("e95a"), s = e("50c4"), u = e("8418"), a = e("35a1");
      i.exports = function(l) {
        var c, f, v, p, h, m, y = o(l), b = typeof this == "function" ? this : Array, O = arguments.length, C = O > 1 ? arguments[1] : void 0, w = C !== void 0, _ = a(y), g = 0;
        if (w && (C = n(C, O > 2 ? arguments[2] : void 0, 2)), _ == null || b == Array && t(_)) for (c = s(y.length), f = new b(c); c > g; g++) m = w ? C(y[g], g) : y[g], u(f, g, m);
        else for (p = _.call(y), h = p.next, f = new b(); !(v = h.call(p)).done; g++) m = w ? r(p, C, [v.value, g], !0) : v.value, u(f, g, m);
        return f.length = g, f;
      };
    }, "4f43": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
	<defs>\r
		<style>\r
			#icon-close .cls-2,#icon-close .cls-3,#icon-close .cls-4{stroke-width:2px;}#icon-close .cls-3,#icon-close .cls-4{stroke-linecap:round;}#icon-close .cls-3{stroke-dasharray:3 4;}#icon-close .cls-5,#icon-close .cls-6{stroke-miterlimit:10;}#icon-close .cls-5{stroke-width:2.2px;}#icon-close .cls-6{stroke-width:3.39px;}\r
		</style>\r
	</defs>\r
	<g id="icon-close_图层_2" data-name="图层 2">\r
		<g id="icon-close_图层_1-2" data-name="图层 1">\r
			<g id="icon-close_组_98" data-name="组 98">\r
				<g id="icon-close_矩形_60" data-name="矩形 60">\r
					<rect class="cls-1" width="50" height="27" rx="5" />\r
					<rect class="cls-2" x="1" y="1" width="48" height="25" rx="4" />\r
				</g>\r
				<g id="icon-close_组_97" data-name="组 97">\r
					<path id="icon-close_路径_85" data-name="路径 85" class="cls-3" d="M9.5,8H40.18" />\r
					<path id="icon-close_路径_86" data-name="路径 86" class="cls-3" d="M9.5,13.5H40.18" />\r
					<path id="icon-close_路径_87" data-name="路径 87" class="cls-3" d="M9.5,19h3.17" />\r
					<path id="icon-close_路径_89" data-name="路径 89" class="cls-4" d="M16.5,19h17" />\r
					<path id="icon-close_路径_88" data-name="路径 88" class="cls-3" d="M37.5,19h2.68" />\r
				</g>\r
			</g>\r
			<path class="cls-5" d="M25.18,34.82l5.32-4.25a.07.07,0,0,0,0-.12H19.83a.07.07,0,0,0,0,.12l5.31,4.25A.06.06,0,0,0,25.18,34.82Z" />\r
			<circle class="cls-6" cx="25.14" cy="32.58" r="1" />\r
		</g>\r
	</g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, "50c4": function(i, d, e) {
      var n = e("a691"), o = Math.min;
      i.exports = function(r) {
        return r > 0 ? o(n(r), 9007199254740991) : 0;
      };
    }, 5135: function(i, d) {
      var e = {}.hasOwnProperty;
      i.exports = function(n, o) {
        return e.call(n, o);
      };
    }, 5270: function(i, d, e) {
      var n = e("c532"), o = e("c401"), r = e("2e67"), t = e("2444");
      function s(u) {
        u.cancelToken && u.cancelToken.throwIfRequested();
      }
      i.exports = function(u) {
        s(u), u.headers = u.headers || {}, u.data = o(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(l) {
          delete u.headers[l];
        });
        var a = u.adapter || t.adapter;
        return a(u).then(function(l) {
          return s(u), l.data = o(l.data, l.headers, u.transformResponse), l;
        }, function(l) {
          return r(l) || (s(u), l && l.response && (l.response.data = o(l.response.data, l.response.headers, u.transformResponse))), Promise.reject(l);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), s = e("1d80"), u = e("8aa5"), a = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, v = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, h, m, y) {
        var b = y.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, O = y.REPLACE_KEEPS_$0, C = b ? "$" : "$0";
        return [function(w, _) {
          var g = s(this), S = w == null ? void 0 : w[p];
          return S !== void 0 ? S.call(w, g, _) : h.call(String(g), w, _);
        }, function(w, _) {
          if (!b && O || typeof _ == "string" && _.indexOf(C) === -1) {
            var g = m(h, w, this, _);
            if (g.done) return g.value;
          }
          var S = o(w), j = String(this), L = typeof _ == "function";
          L || (_ = String(_));
          var E = S.global;
          if (E) {
            var M = S.unicode;
            S.lastIndex = 0;
          }
          for (var V = []; ; ) {
            var J = l(S, j);
            if (J === null || (V.push(J), !E)) break;
            var ie = String(J[0]);
            ie === "" && (S.lastIndex = u(j, r(S.lastIndex), M));
          }
          for (var H = "", W = 0, F = 0; F < V.length; F++) {
            J = V[F];
            for (var T = String(J[0]), A = c(f(t(J.index), j.length), 0), Q = [], Z = 1; Z < J.length; Z++) Q.push(v(J[Z]));
            var U = J.groups;
            if (L) {
              var _e = [T].concat(Q, A, j);
              U !== void 0 && _e.push(U);
              var ve = String(_.apply(void 0, _e));
            } else ve = a(T, j, A, Q, U, _);
            A >= W && (H += j.slice(W, A) + ve, W = A + T.length);
          }
          return H + j.slice(W);
        }];
      });
    }, "545a": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, 5530: function(i, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, o) {
        var r = n.document, t = r.documentElement, s = r.querySelector('meta[name="viewport"]'), u = r.querySelector('meta[name="flexible"]'), a = 0, l = 0, c = o.flexible || (o.flexible = {});
        if (s) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = s.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (l = parseFloat(f[1]), a = parseInt(1 / l));
        } else if (u) {
          var v = u.getAttribute("content");
          if (v) {
            var p = v.match(/initial\-dpr=([\d\.]+)/), h = v.match(/maximum\-dpr=([\d\.]+)/);
            p && (a = parseFloat(p[1]), l = parseFloat((1 / a).toFixed(2))), h && (a = parseFloat(h[1]), l = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !l) {
          n.navigator.appVersion.match(/android/gi);
          var m = n.navigator.appVersion.match(/iphone/gi), y = n.devicePixelRatio;
          a = m ? y >= 3 && (!a || a >= 3) ? 3 : y >= 2 && (!a || a >= 2) ? 2 : 1 : 1, l = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !s) if (s = r.createElement("meta"), s.setAttribute("name", "viewport"), s.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(s);
        else {
          var b = r.createElement("div");
          b.appendChild(s), r.write(b.innerHTML);
        }
        function O() {
          var C = t.getBoundingClientRect().width, w = C / 10;
          t.style.fontSize = w + "px", c.rem = n.rem = w;
        }
        n.addEventListener("resize", function() {
          O();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && O();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * a + "px" : r.addEventListener("DOMContentLoaded", function(C) {
          r.body.style.fontSize = 10 * a + "px";
        }, !1), O(), c.dpr = n.dpr = a, c.refreshRem = O, c.rem2px = function(C) {
          var w = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (w += "px"), w;
        }, c.px2rem = function(C) {
          var w = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (w += "rem"), w;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, d, e) {
      var n = e("c430"), o = e("c6cd");
      (i.exports = function(r, t) {
        return o[r] || (o[r] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, d, e) {
      var n = e("d066"), o = e("241c"), r = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(s) {
        var u = o.f(t(s)), a = r.f;
        return a ? u.concat(a(s)) : u;
      };
    }, "5a34": function(i, d, e) {
      var n = e("44e7");
      i.exports = function(o) {
        if (n(o)) throw TypeError("The method doesn't accept regular expressions");
        return o;
      };
    }, "5c6c": function(i, d) {
      i.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(i, d, e) {
      i.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(i, d, e) {
      var n = e("c6b6"), o = e("da84");
      i.exports = n(o.process) == "process";
    }, 6062: function(i, d, e) {
      var n = e("6d61"), o = e("6566");
      i.exports = n("Set", function(r) {
        return function() {
          return r(this, arguments.length ? arguments[0] : void 0);
        };
      }, o);
    }, 6547: function(i, d, e) {
      var n = e("a691"), o = e("1d80"), r = function(t) {
        return function(s, u) {
          var a, l, c = String(o(s)), f = n(u), v = c.length;
          return f < 0 || f >= v ? t ? "" : void 0 : (a = c.charCodeAt(f), a < 55296 || a > 56319 || f + 1 === v || (l = c.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? c.charAt(f) : a : t ? c.slice(f, f + 2) : l - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), s = e("19aa"), u = e("2266"), a = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, v = e("69f3"), p = v.set, h = v.getterFor;
      i.exports = { getConstructor: function(m, y, b, O) {
        var C = m(function(S, j) {
          s(S, C, y), p(S, { type: y, index: o(null), first: void 0, last: void 0, size: 0 }), c || (S.size = 0), j != null && u(j, S[O], { that: S, AS_ENTRIES: b });
        }), w = h(y), _ = function(S, j, L) {
          var E, M, V = w(S), J = g(S, j);
          return J ? J.value = L : (V.last = J = { index: M = f(j, !0), key: j, value: L, previous: E = V.last, next: void 0, removed: !1 }, V.first || (V.first = J), E && (E.next = J), c ? V.size++ : S.size++, M !== "F" && (V.index[M] = J)), S;
        }, g = function(S, j) {
          var L, E = w(S), M = f(j);
          if (M !== "F") return E.index[M];
          for (L = E.first; L; L = L.next) if (L.key == j) return L;
        };
        return r(C.prototype, { clear: function() {
          for (var S = this, j = w(S), L = j.index, E = j.first; E; ) E.removed = !0, E.previous && (E.previous = E.previous.next = void 0), delete L[E.index], E = E.next;
          j.first = j.last = void 0, c ? j.size = 0 : S.size = 0;
        }, delete: function(S) {
          var j = this, L = w(j), E = g(j, S);
          if (E) {
            var M = E.next, V = E.previous;
            delete L.index[E.index], E.removed = !0, V && (V.next = M), M && (M.previous = V), L.first == E && (L.first = M), L.last == E && (L.last = V), c ? L.size-- : j.size--;
          }
          return !!E;
        }, forEach: function(S) {
          for (var j, L = w(this), E = t(S, arguments.length > 1 ? arguments[1] : void 0, 3); j = j ? j.next : L.first; )
            for (E(j.value, j.key, this); j && j.removed; ) j = j.previous;
        }, has: function(S) {
          return !!g(this, S);
        } }), r(C.prototype, b ? { get: function(S) {
          var j = g(this, S);
          return j && j.value;
        }, set: function(S, j) {
          return _(this, S === 0 ? 0 : S, j);
        } } : { add: function(S) {
          return _(this, S = S === 0 ? 0 : S, S);
        } }), c && n(C.prototype, "size", { get: function() {
          return w(this).size;
        } }), C;
      }, setStrong: function(m, y, b) {
        var O = y + " Iterator", C = h(y), w = h(O);
        a(m, y, function(_, g) {
          p(this, { type: O, target: _, state: C(_), kind: g, last: void 0 });
        }, function() {
          for (var _ = w(this), g = _.kind, S = _.last; S && S.removed; ) S = S.previous;
          return _.target && (_.last = S = S ? S.next : _.state.first) ? g == "keys" ? { value: S.key, done: !1 } : g == "values" ? { value: S.value, done: !1 } : { value: [S.key, S.value], done: !1 } : (_.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), l(y);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(s, u) {
        var a;
        return o(s) && (a = s.constructor, typeof a != "function" || a !== Array && !o(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), s = e("da84"), u = e("861d"), a = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), v = e("d012"), p = s.WeakMap, h = function(_) {
        return r(_) ? o(_) : n(_, {});
      }, m = function(_) {
        return function(g) {
          var S;
          if (!u(g) || (S = o(g)).type !== _) throw TypeError("Incompatible receiver, " + _ + " required");
          return S;
        };
      };
      if (t) {
        var y = c.state || (c.state = new p()), b = y.get, O = y.has, C = y.set;
        n = function(_, g) {
          return g.facade = _, C.call(y, _, g), g;
        }, o = function(_) {
          return b.call(y, _) || {};
        }, r = function(_) {
          return O.call(y, _);
        };
      } else {
        var w = f("state");
        v[w] = !0, n = function(_, g) {
          return g.facade = _, a(_, w, g), g;
        }, o = function(_) {
          return l(_, w) ? _[w] : {};
        }, r = function(_) {
          return l(_, w);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: h, getterFor: m };
    }, "6d55": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, "6d61": function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), s = e("f183"), u = e("2266"), a = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), v = e("d44e"), p = e("7156");
      i.exports = function(h, m, y) {
        var b = h.indexOf("Map") !== -1, O = h.indexOf("Weak") !== -1, C = b ? "set" : "add", w = o[h], _ = w && w.prototype, g = w, S = {}, j = function(H) {
          var W = _[H];
          t(_, H, H == "add" ? function(F) {
            return W.call(this, F === 0 ? 0 : F), this;
          } : H == "delete" ? function(F) {
            return !(O && !l(F)) && W.call(this, F === 0 ? 0 : F);
          } : H == "get" ? function(F) {
            return O && !l(F) ? void 0 : W.call(this, F === 0 ? 0 : F);
          } : H == "has" ? function(F) {
            return !(O && !l(F)) && W.call(this, F === 0 ? 0 : F);
          } : function(F, T) {
            return W.call(this, F === 0 ? 0 : F, T), this;
          });
        }, L = r(h, typeof w != "function" || !(O || _.forEach && !c(function() {
          new w().entries().next();
        })));
        if (L) g = y.getConstructor(m, h, b, C), s.REQUIRED = !0;
        else if (r(h, !0)) {
          var E = new g(), M = E[C](O ? {} : -0, 1) != E, V = c(function() {
            E.has(1);
          }), J = f(function(H) {
            new w(H);
          }), ie = !O && c(function() {
            for (var H = new w(), W = 5; W--; ) H[C](W, W);
            return !H.has(-0);
          });
          J || (g = m(function(H, W) {
            a(H, g, h);
            var F = p(new w(), H, g);
            return W != null && u(W, F[C], { that: F, AS_ENTRIES: b }), F;
          }), g.prototype = _, _.constructor = g), (V || ie) && (j("delete"), j("has"), b && j("get")), (ie || M) && j(C), O && _.clear && delete _.clear;
        }
        return S[h] = g, n({ global: !0, forced: g != w }, S), v(g, h), O || y.setStrong(g, h, b), g;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), s = e("8925"), u = e("69f3"), a = u.get, l = u.enforce, c = String(String).split("String");
      (i.exports = function(f, v, p, h) {
        var m, y = !!h && !!h.unsafe, b = !!h && !!h.enumerable, O = !!h && !!h.noTargetGet;
        typeof p == "function" && (typeof v != "string" || r(p, "name") || o(p, "name", v), m = l(p), m.source || (m.source = c.join(typeof v == "string" ? v : ""))), f !== n ? (y ? !O && f[v] && (b = !0) : delete f[v], b ? f[v] = p : o(f, v, p)) : b ? f[v] = p : t(v, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || s(this);
      });
    }, "70d3": function(i, d, e) {
    }, 7156: function(i, d, e) {
      var n = e("861d"), o = e("d2bb");
      i.exports = function(r, t, s) {
        var u, a;
        return o && typeof (u = t.constructor) == "function" && u !== s && n(a = u.prototype) && a !== s.prototype && o(r, a), r;
      };
    }, 7305: function(i, d, e) {
    }, 7320: function(i, d, e) {
    }, 7418: function(i, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, d, e) {
      var n = e("428f"), o = e("5135"), r = e("e538"), t = e("9bf2").f;
      i.exports = function(s) {
        var u = n.Symbol || (n.Symbol = {});
        o(u, s) || t(u, s, { value: r.f(s) });
      };
    }, 7839: function(i, d) {
      i.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(i, d, e) {
      function n(o) {
        this.message = o;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, i.exports = n;
    }, "7aac": function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(o, r, t, s, u, a) {
          var l = [];
          l.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), n.isString(s) && l.push("path=" + s), n.isString(u) && l.push("domain=" + u), a === !0 && l.push("secure"), document.cookie = l.join("; ");
        }, read: function(o) {
          var r = document.cookie.match(new RegExp("(^|;\\s*)(" + o + ")=([^;]*)"));
          return r ? decodeURIComponent(r[3]) : null;
        }, remove: function(o) {
          this.write(o, "", Date.now() - 864e5);
        } };
      }() : /* @__PURE__ */ function() {
        return { write: function() {
        }, read: function() {
          return null;
        }, remove: function() {
        } };
      }();
    }, "7b0b": function(i, d, e) {
      var n = e("1d80");
      i.exports = function(o) {
        return Object(n(o));
      };
    }, "7c73": function(i, d, e) {
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), s = e("d012"), u = e("1be4"), a = e("cc12"), l = e("f772"), c = ">", f = "<", v = "prototype", p = "script", h = l("IE_PROTO"), m = function() {
      }, y = function(w) {
        return f + p + c + w + f + "/" + p + c;
      }, b = function(w) {
        w.write(y("")), w.close();
        var _ = w.parentWindow.Object;
        return w = null, _;
      }, O = function() {
        var w, _ = a("iframe"), g = "java" + p + ":";
        return _.style.display = "none", u.appendChild(_), _.src = String(g), w = _.contentWindow.document, w.open(), w.write(y("document.F=Object")), w.close(), w.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? b(n) : O();
        for (var w = t.length; w--; ) delete C[v][t[w]];
        return C();
      };
      s[h] = !0, i.exports = Object.create || function(w, _) {
        var g;
        return w !== null ? (m[v] = o(w), g = new m(), m[v] = null, g[h] = w) : g = C(), _ === void 0 ? g : r(g, _);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", s = !0;
      t in [] && Array(1)[t](function() {
        s = !1;
      }), n({ target: "Array", proto: !0, forced: s }, { find: function(u) {
        return o(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), s = e("d44e"), u = e("9112"), a = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), v = e("ae93"), p = v.IteratorPrototype, h = v.BUGGY_SAFARI_ITERATORS, m = l("iterator"), y = "keys", b = "values", O = "entries", C = function() {
        return this;
      };
      i.exports = function(w, _, g, S, j, L, E) {
        o(g, _, S);
        var M, V, J, ie = function(Z) {
          if (Z === j && A) return A;
          if (!h && Z in F) return F[Z];
          switch (Z) {
            case y:
              return function() {
                return new g(this, Z);
              };
            case b:
              return function() {
                return new g(this, Z);
              };
            case O:
              return function() {
                return new g(this, Z);
              };
          }
          return function() {
            return new g(this);
          };
        }, H = _ + " Iterator", W = !1, F = w.prototype, T = F[m] || F["@@iterator"] || j && F[j], A = !h && T || ie(j), Q = _ == "Array" && F.entries || T;
        if (Q && (M = r(Q.call(new w())), p !== Object.prototype && M.next && (c || r(M) === p || (t ? t(M, p) : typeof M[m] != "function" && u(M, m, C)), s(M, H, !0, !0), c && (f[H] = C))), j == b && T && T.name !== b && (W = !0, A = function() {
          return T.call(this);
        }), c && !E || F[m] === A || u(F, m, A), f[_] = A, j) if (V = { values: ie(b), keys: L ? A : ie(y), entries: ie(O) }, E) for (J in V) (h || W || !(J in F)) && a(F, J, V[J]);
        else n({ target: _, proto: !0, forced: h || W }, V);
        return V;
      };
    }, "7eb5": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, "7f9a": function(i, d, e) {
      var n = e("da84"), o = e("8925"), r = n.WeakMap;
      i.exports = typeof r == "function" && /native code/.test(o(r));
    }, "825a": function(i, d, e) {
      var n = e("861d");
      i.exports = function(o) {
        if (!n(o)) throw TypeError(String(o) + " is not an object");
        return o;
      };
    }, "83ab": function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(i, d, e) {
      var n = e("d925"), o = e("e683");
      i.exports = function(r, t) {
        return r && !n(t) ? o(r, t) : t;
      };
    }, 8418: function(i, d, e) {
      var n = e("c04e"), o = e("9bf2"), r = e("5c6c");
      i.exports = function(t, s, u) {
        var a = n(s);
        a in t ? o.f(t, a, r(0, u)) : t[a] = u;
      };
    }, "861d": function(i, d) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, d, e) {
      var n, o, r;
      (function(t, s) {
        o = [], n = s, r = typeof n == "function" ? n.apply(d, o) : n, r === void 0 || (i.exports = r);
      })(typeof self < "u" && self, function() {
        function t() {
          var s = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!s && "currentScript" in document && document.currentScript || s && s.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (O) {
            var u, a, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, v = c.exec(O.stack) || f.exec(O.stack), p = v && v[1] || !1, h = v && v[2] || !1, m = document.location.href.replace(document.location.hash, ""), y = document.getElementsByTagName("script");
            p === m && (u = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (h - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = u.replace(a, "$1").trim());
            for (var b = 0; b < y.length; b++)
              if (y[b].readyState === "interactive" || y[b].src === p || p === m && y[b].innerHTML && y[b].innerHTML.trim() === l) return y[b];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(i, d, e) {
      var n = e("c6cd"), o = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(r) {
        return o.call(r);
      }), i.exports = n.inspectSource;
    }, "8aa5": function(i, d, e) {
      var n = e("6547").charAt;
      i.exports = function(o, r, t) {
        return r + (t ? n(o, r).length : 1);
      };
    }, "8bbf": function(i, d) {
      i.exports = G;
    }, "8df4": function(i, d, e) {
      var n = e("7a77");
      function o(r) {
        if (typeof r != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(u) {
          t = u;
        });
        var s = this;
        r(function(u) {
          s.reason || (s.reason = new n(u), t(s.reason));
        });
      }
      o.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, o.source = function() {
        var r, t = new o(function(s) {
          r = s;
        });
        return { token: t, cancel: r };
      }, i.exports = o;
    }, "90e3": function(i, d) {
      var e = 0, n = Math.random();
      i.exports = function(o) {
        return "Symbol(" + String(o === void 0 ? "" : o) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("5c6c");
      i.exports = n ? function(t, s, u) {
        return o.f(t, s, r(1, u));
      } : function(t, s, u) {
        return t[s] = u, t;
      };
    }, 9263: function(i, d, e) {
      var n = e("ad6d"), o = e("9f7f"), r = RegExp.prototype.exec, t = String.prototype.replace, s = r, u = function() {
        var f = /a/, v = /b*/g;
        return r.call(f, "a"), r.call(v, "a"), f.lastIndex !== 0 || v.lastIndex !== 0;
      }(), a = o.UNSUPPORTED_Y || o.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, c = u || l || a;
      c && (s = function(f) {
        var v, p, h, m, y = this, b = a && y.sticky, O = n.call(y), C = y.source, w = 0, _ = f;
        return b && (O = O.replace("y", ""), O.indexOf("g") === -1 && (O += "g"), _ = String(f).slice(y.lastIndex), y.lastIndex > 0 && (!y.multiline || y.multiline && f[y.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", _ = " " + _, w++), p = new RegExp("^(?:" + C + ")", O)), l && (p = new RegExp("^" + C + "$(?!\\s)", O)), u && (v = y.lastIndex), h = r.call(b ? p : y, _), b ? h ? (h.input = h.input.slice(w), h[0] = h[0].slice(w), h.index = y.lastIndex, y.lastIndex += h[0].length) : y.lastIndex = 0 : u && h && (y.lastIndex = y.global ? h.index + h[0].length : v), l && h && h.length > 1 && t.call(h[0], p, function() {
          for (m = 1; m < arguments.length - 2; m++) arguments[m] === void 0 && (h[m] = void 0);
        }), h;
      }), i.exports = s;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(l, c) {
        var f = s[t(l)];
        return f == a || f != u && (typeof c == "function" ? n(c) : !!c);
      }, t = r.normalize = function(l) {
        return String(l).replace(o, ".").toLowerCase();
      }, s = r.data = {}, u = r.NATIVE = "N", a = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, s = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", l = typeof i == "object", c = e.regeneratorRuntime;
        if (c) l && (i.exports = c);
        else {
          c = e.regeneratorRuntime = l ? i.exports : {}, c.wrap = w;
          var f = "suspendedStart", v = "suspendedYield", p = "executing", h = "completed", m = {}, y = {};
          y[s] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, O = b && b(b(W([])));
          O && O !== o && r.call(O, s) && (y = O);
          var C = j.prototype = g.prototype = Object.create(y);
          S.prototype = C.constructor = j, j.constructor = S, j[a] = S.displayName = "GeneratorFunction", c.isGeneratorFunction = function(T) {
            var A = typeof T == "function" && T.constructor;
            return !!A && (A === S || (A.displayName || A.name) === "GeneratorFunction");
          }, c.mark = function(T) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(T, j) : (T.__proto__ = j, a in T || (T[a] = "GeneratorFunction")), T.prototype = Object.create(C), T;
          }, c.awrap = function(T) {
            return { __await: T };
          }, L(E.prototype), E.prototype[u] = function() {
            return this;
          }, c.AsyncIterator = E, c.async = function(T, A, Q, Z) {
            var U = new E(w(T, A, Q, Z));
            return c.isGeneratorFunction(A) ? U : U.next().then(function(_e) {
              return _e.done ? _e.value : U.next();
            });
          }, L(C), C[a] = "Generator", C[s] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, c.keys = function(T) {
            var A = [];
            for (var Q in T) A.push(Q);
            return A.reverse(), function Z() {
              for (; A.length; ) {
                var U = A.pop();
                if (U in T) return Z.value = U, Z.done = !1, Z;
              }
              return Z.done = !0, Z;
            };
          }, c.values = W, H.prototype = { constructor: H, reset: function(T) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ie), !T) for (var A in this) A.charAt(0) === "t" && r.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var T = this.tryEntries[0], A = T.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(T) {
            if (this.done) throw T;
            var A = this;
            function Q(Be, Re) {
              return _e.type = "throw", _e.arg = T, A.next = Be, Re && (A.method = "next", A.arg = n), !!Re;
            }
            for (var Z = this.tryEntries.length - 1; Z >= 0; --Z) {
              var U = this.tryEntries[Z], _e = U.completion;
              if (U.tryLoc === "root") return Q("end");
              if (U.tryLoc <= this.prev) {
                var ve = r.call(U, "catchLoc"), Le = r.call(U, "finallyLoc");
                if (ve && Le) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                } else if (ve) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                } else {
                  if (!Le) throw new Error("try statement without catch or finally");
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                }
              }
            }
          }, abrupt: function(T, A) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var Z = this.tryEntries[Q];
              if (Z.tryLoc <= this.prev && r.call(Z, "finallyLoc") && this.prev < Z.finallyLoc) {
                var U = Z;
                break;
              }
            }
            U && (T === "break" || T === "continue") && U.tryLoc <= A && A <= U.finallyLoc && (U = null);
            var _e = U ? U.completion : {};
            return _e.type = T, _e.arg = A, U ? (this.method = "next", this.next = U.finallyLoc, m) : this.complete(_e);
          }, complete: function(T, A) {
            if (T.type === "throw") throw T.arg;
            return T.type === "break" || T.type === "continue" ? this.next = T.arg : T.type === "return" ? (this.rval = this.arg = T.arg, this.method = "return", this.next = "end") : T.type === "normal" && A && (this.next = A), m;
          }, finish: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var Q = this.tryEntries[A];
              if (Q.finallyLoc === T) return this.complete(Q.completion, Q.afterLoc), ie(Q), m;
            }
          }, catch: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var Q = this.tryEntries[A];
              if (Q.tryLoc === T) {
                var Z = Q.completion;
                if (Z.type === "throw") {
                  var U = Z.arg;
                  ie(Q);
                }
                return U;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(T, A, Q) {
            return this.delegate = { iterator: W(T), resultName: A, nextLoc: Q }, this.method === "next" && (this.arg = n), m;
          } };
        }
        function w(T, A, Q, Z) {
          var U = A && A.prototype instanceof g ? A : g, _e = Object.create(U.prototype), ve = new H(Z || []);
          return _e._invoke = M(T, Q, ve), _e;
        }
        function _(T, A, Q) {
          try {
            return { type: "normal", arg: T.call(A, Q) };
          } catch (Z) {
            return { type: "throw", arg: Z };
          }
        }
        function g() {
        }
        function S() {
        }
        function j() {
        }
        function L(T) {
          ["next", "throw", "return"].forEach(function(A) {
            T[A] = function(Q) {
              return this._invoke(A, Q);
            };
          });
        }
        function E(T) {
          function A(U, _e, ve, Le) {
            var Be = _(T[U], T, _e);
            if (Be.type !== "throw") {
              var Re = Be.arg, Ae = Re.value;
              return Ae && typeof Ae == "object" && r.call(Ae, "__await") ? Promise.resolve(Ae.__await).then(function(Ne) {
                A("next", Ne, ve, Le);
              }, function(Ne) {
                A("throw", Ne, ve, Le);
              }) : Promise.resolve(Ae).then(function(Ne) {
                Re.value = Ne, ve(Re);
              }, Le);
            }
            Le(Be.arg);
          }
          var Q;
          function Z(U, _e) {
            function ve() {
              return new Promise(function(Le, Be) {
                A(U, _e, Le, Be);
              });
            }
            return Q = Q ? Q.then(ve, ve) : ve();
          }
          this._invoke = Z;
        }
        function M(T, A, Q) {
          var Z = f;
          return function(U, _e) {
            if (Z === p) throw new Error("Generator is already running");
            if (Z === h) {
              if (U === "throw") throw _e;
              return F();
            }
            for (Q.method = U, Q.arg = _e; ; ) {
              var ve = Q.delegate;
              if (ve) {
                var Le = V(ve, Q);
                if (Le) {
                  if (Le === m) continue;
                  return Le;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (Z === f) throw Z = h, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              Z = p;
              var Be = _(T, A, Q);
              if (Be.type === "normal") {
                if (Z = Q.done ? h : v, Be.arg === m) continue;
                return { value: Be.arg, done: Q.done };
              }
              Be.type === "throw" && (Z = h, Q.method = "throw", Q.arg = Be.arg);
            }
          };
        }
        function V(T, A) {
          var Q = T.iterator[A.method];
          if (Q === n) {
            if (A.delegate = null, A.method === "throw") {
              if (T.iterator.return && (A.method = "return", A.arg = n, V(T, A), A.method === "throw")) return m;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return m;
          }
          var Z = _(Q, T.iterator, A.arg);
          if (Z.type === "throw") return A.method = "throw", A.arg = Z.arg, A.delegate = null, m;
          var U = Z.arg;
          return U ? U.done ? (A[T.resultName] = U.value, A.next = T.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, m) : U : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, m);
        }
        function J(T) {
          var A = { tryLoc: T[0] };
          1 in T && (A.catchLoc = T[1]), 2 in T && (A.finallyLoc = T[2], A.afterLoc = T[3]), this.tryEntries.push(A);
        }
        function ie(T) {
          var A = T.completion || {};
          A.type = "normal", delete A.arg, T.completion = A;
        }
        function H(T) {
          this.tryEntries = [{ tryLoc: "root" }], T.forEach(J, this), this.reset(!0);
        }
        function W(T) {
          if (T) {
            var A = T[s];
            if (A) return A.call(T);
            if (typeof T.next == "function") return T;
            if (!isNaN(T.length)) {
              var Q = -1, Z = function U() {
                for (; ++Q < T.length; ) if (r.call(T, Q)) return U.value = T[Q], U.done = !1, U;
                return U.value = n, U.done = !0, U;
              };
              return Z.next = Z;
            }
          }
          return { next: F };
        }
        function F() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), s = e("7b0b"), u = e("50c4"), a = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), v = e("2d00"), p = f("isConcatSpreadable"), h = 9007199254740991, m = "Maximum allowed index exceeded", y = v >= 51 || !o(function() {
        var w = [];
        return w[p] = !1, w.concat()[0] !== w;
      }), b = c("concat"), O = function(w) {
        if (!t(w)) return !1;
        var _ = w[p];
        return _ !== void 0 ? !!_ : r(w);
      }, C = !y || !b;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(w) {
        var _, g, S, j, L, E = s(this), M = l(E, 0), V = 0;
        for (_ = -1, S = arguments.length; _ < S; _++) if (L = _ === -1 ? E : arguments[_], O(L)) {
          if (j = u(L.length), V + j > h) throw TypeError(m);
          for (g = 0; g < j; g++, V++) g in L && a(M, V, L[g]);
        } else {
          if (V >= h) throw TypeError(m);
          a(M, V++, L);
        }
        return M.length = V, M;
      } });
    }, "9aaf": function(i, d, e) {
      e("70d3");
    }, "9bdd": function(i, d, e) {
      var n = e("825a"), o = e("2a62");
      i.exports = function(r, t, s, u) {
        try {
          return u ? t(n(s)[0], s[1]) : t(s);
        } catch (a) {
          throw o(r), a;
        }
      };
    }, "9bf2": function(i, d, e) {
      var n = e("83ab"), o = e("0cfb"), r = e("825a"), t = e("c04e"), s = Object.defineProperty;
      d.f = n ? s : function(u, a, l) {
        if (r(u), a = t(a, !0), r(l), o) try {
          return s(u, a, l);
        } catch {
        }
        if ("get" in l || "set" in l) throw TypeError("Accessors not supported");
        return "value" in l && (u[a] = l.value), u;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), s = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(a, l, c) {
        var f = l + " Iterator";
        return a.prototype = o(n, { next: r(1, c) }), t(a, f, !1, !0), s[f] = u, a;
      };
    }, "9f7f": function(i, d, e) {
      var n = e("d039");
      function o(r, t) {
        return RegExp(r, t);
      }
      d.UNSUPPORTED_Y = n(function() {
        var r = o("a", "y");
        return r.lastIndex = 2, r.exec("abcd") != null;
      }), d.BROKEN_CARET = n(function() {
        var r = o("^r", "gy");
        return r.lastIndex = 2, r.exec("str") != null;
      });
    }, a434: function(i, d, e) {
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), s = e("7b0b"), u = e("65f0"), a = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, v = Math.min, p = 9007199254740991, h = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(m, y) {
        var b, O, C, w, _, g, S = s(this), j = t(S.length), L = o(m, j), E = arguments.length;
        if (E === 0 ? b = O = 0 : E === 1 ? (b = 0, O = j - L) : (b = E - 2, O = v(f(r(y), 0), j - L)), j + b - O > p) throw TypeError(h);
        for (C = u(S, O), w = 0; w < O; w++) _ = L + w, _ in S && a(C, w, S[_]);
        if (C.length = O, b < O) {
          for (w = L; w < j - O; w++) _ = w + O, g = w + b, _ in S ? S[g] = S[_] : delete S[g];
          for (w = j; w > j - O + b; w--) delete S[w - 1];
        } else if (b > O) for (w = j - O; w > L; w--) _ = w + O - 1, g = w + b - 1, _ in S ? S[g] = S[_] : delete S[g];
        for (w = 0; w < b; w++) S[w + L] = arguments[w + 2];
        return S.length = j - O + b, C;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), s = e("83ab"), u = e("4930"), a = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), v = e("861d"), p = e("825a"), h = e("7b0b"), m = e("fc6a"), y = e("c04e"), b = e("5c6c"), O = e("7c73"), C = e("df75"), w = e("241c"), _ = e("057f"), g = e("7418"), S = e("06cf"), j = e("9bf2"), L = e("d1e7"), E = e("9112"), M = e("6eeb"), V = e("5692"), J = e("f772"), ie = e("d012"), H = e("90e3"), W = e("b622"), F = e("e538"), T = e("746f"), A = e("d44e"), Q = e("69f3"), Z = e("b727").forEach, U = J("hidden"), _e = "Symbol", ve = "prototype", Le = W("toPrimitive"), Be = Q.set, Re = Q.getterFor(_e), Ae = Object[ve], Ne = o.Symbol, We = r("JSON", "stringify"), Ze = S.f, B = j.f, $ = _.f, ee = L.f, D = V("symbols"), ne = V("op-symbols"), re = V("string-to-symbol-registry"), ke = V("symbol-to-string-registry"), he = V("wks"), se = o.QObject, Se = !se || !se[ve] || !se[ve].findChild, Oe = s && l(function() {
        return O(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, ce) {
        var ge = Ze(Ae, oe);
        ge && delete Ae[oe], B(q, oe, ce), ge && q !== Ae && B(Ae, oe, ge);
      } : B, le = function(q, oe) {
        var ce = D[q] = O(Ne[ve]);
        return Be(ce, { type: _e, tag: q, description: oe }), s || (ce.description = oe), ce;
      }, I = a ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Ne;
      }, X = function(q, oe, ce) {
        q === Ae && X(ne, oe, ce), p(q);
        var ge = y(oe, !0);
        return p(ce), c(D, ge) ? (ce.enumerable ? (c(q, U) && q[U][ge] && (q[U][ge] = !1), ce = O(ce, { enumerable: b(0, !1) })) : (c(q, U) || B(q, U, b(1, {})), q[U][ge] = !0), Oe(q, ge, ce)) : B(q, ge, ce);
      }, Ve = function(q, oe) {
        p(q);
        var ce = m(oe), ge = C(ce).concat(fe(ce));
        return Z(ge, function(De) {
          s && !dt.call(ce, De) || X(q, De, ce[De]);
        }), q;
      }, rt = function(q, oe) {
        return oe === void 0 ? O(q) : Ve(O(q), oe);
      }, dt = function(q) {
        var oe = y(q, !0), ce = ee.call(this, oe);
        return !(this === Ae && c(D, oe) && !c(ne, oe)) && (!(ce || !c(this, oe) || !c(D, oe) || c(this, U) && this[U][oe]) || ce);
      }, z = function(q, oe) {
        var ce = m(q), ge = y(oe, !0);
        if (ce !== Ae || !c(D, ge) || c(ne, ge)) {
          var De = Ze(ce, ge);
          return !De || !c(D, ge) || c(ce, U) && ce[U][ge] || (De.enumerable = !0), De;
        }
      }, ae = function(q) {
        var oe = $(m(q)), ce = [];
        return Z(oe, function(ge) {
          c(D, ge) || c(ie, ge) || ce.push(ge);
        }), ce;
      }, fe = function(q) {
        var oe = q === Ae, ce = $(oe ? ne : m(q)), ge = [];
        return Z(ce, function(De) {
          !c(D, De) || oe && !c(Ae, De) || ge.push(D[De]);
        }), ge;
      };
      if (u || (Ne = function() {
        if (this instanceof Ne) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = H(q), ce = function(ge) {
          this === Ae && ce.call(ne, ge), c(this, U) && c(this[U], oe) && (this[U][oe] = !1), Oe(this, oe, b(1, ge));
        };
        return s && Se && Oe(Ae, oe, { configurable: !0, set: ce }), le(oe, q);
      }, M(Ne[ve], "toString", function() {
        return Re(this).tag;
      }), M(Ne, "withoutSetter", function(q) {
        return le(H(q), q);
      }), L.f = dt, j.f = X, S.f = z, w.f = _.f = ae, g.f = fe, F.f = function(q) {
        return le(W(q), q);
      }, s && (B(Ne[ve], "description", { configurable: !0, get: function() {
        return Re(this).description;
      } }), t || M(Ae, "propertyIsEnumerable", dt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Ne }), Z(C(he), function(q) {
        T(q);
      }), n({ target: _e, stat: !0, forced: !u }, { for: function(q) {
        var oe = String(q);
        if (c(re, oe)) return re[oe];
        var ce = Ne(oe);
        return re[oe] = ce, ke[ce] = oe, ce;
      }, keyFor: function(q) {
        if (!I(q)) throw TypeError(q + " is not a symbol");
        if (c(ke, q)) return ke[q];
      }, useSetter: function() {
        Se = !0;
      }, useSimple: function() {
        Se = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !s }, { create: rt, defineProperty: X, defineProperties: Ve, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: ae, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: l(function() {
        g.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return g.f(h(q));
      } }), We) {
        var me = !u || l(function() {
          var q = Ne();
          return We([q]) != "[null]" || We({ a: q }) != "{}" || We(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: me }, { stringify: function(q, oe, ce) {
          for (var ge, De = [q], ze = 1; arguments.length > ze; ) De.push(arguments[ze++]);
          if (ge = oe, (v(oe) || q !== void 0) && !I(q)) return f(oe) || (oe = function(it, Ee) {
            if (typeof ge == "function" && (Ee = ge.call(this, it, Ee)), !I(Ee)) return Ee;
          }), De[1] = oe, We.apply(null, De);
        } });
      }
      Ne[ve][Le] || E(Ne[ve], Le, Ne[ve].valueOf), A(Ne, _e), ie[U] = !0;
    }, a630: function(i, d, e) {
      var n = e("23e7"), o = e("4df4"), r = e("1c7e"), t = !r(function(s) {
        Array.from(s);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: o });
    }, a640: function(i, d, e) {
      var n = e("d039");
      i.exports = function(o, r) {
        var t = [][o];
        return !!t && n(function() {
          t.call(null, r || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(i, d) {
      var e = Math.ceil, n = Math.floor;
      i.exports = function(o) {
        return isNaN(o = +o) ? 0 : (o > 0 ? n : e)(o);
      };
    }, ab13: function(i, d, e) {
      var n = e("b622"), o = n("match");
      i.exports = function(r) {
        var t = /./;
        try {
          "/./"[r](t);
        } catch {
          try {
            return t[o] = !1, "/./"[r](t);
          } catch {
          }
        }
        return !1;
      };
    }, ac1f: function(i, d, e) {
      var n = e("23e7"), o = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== o }, { exec: o });
    }, acce: function(i, d, e) {
    }, ad6d: function(i, d, e) {
      var n = e("825a");
      i.exports = function() {
        var o = n(this), r = "";
        return o.global && (r += "g"), o.ignoreCase && (r += "i"), o.multiline && (r += "m"), o.dotAll && (r += "s"), o.unicode && (r += "u"), o.sticky && (r += "y"), r;
      };
    }, ae93: function(i, d, e) {
      var n, o, r, t = e("d039"), s = e("e163"), u = e("9112"), a = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), v = !1, p = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = s(s(r)), o !== Object.prototype && (n = o)) : v = !0);
      var h = n == null || t(function() {
        var m = {};
        return n[f].call(m) !== m;
      });
      h && (n = {}), c && !h || a(n, f) || u(n, f, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: v };
    }, b041: function(i, d, e) {
      var n = e("00ee"), o = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + o(this) + "]";
      };
    }, b0c0: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2").f, r = Function.prototype, t = r.toString, s = /^\s*function ([^ (]*)/, u = "name";
      n && !(u in r) && o(r, u, { configurable: !0, get: function() {
        try {
          return t.call(this).match(s)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, d, e) {
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), s = e("83b9"), u = e("c345"), a = e("3934"), l = e("2d83");
      i.exports = function(c) {
        return new Promise(function(f, v) {
          var p = c.data, h = c.headers;
          n.isFormData(p) && delete h["Content-Type"];
          var m = new XMLHttpRequest();
          if (c.auth) {
            var y = c.auth.username || "", b = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            h.Authorization = "Basic " + btoa(y + ":" + b);
          }
          var O = s(c.baseURL, c.url);
          if (m.open(c.method.toUpperCase(), t(O, c.params, c.paramsSerializer), !0), m.timeout = c.timeout, m.onreadystatechange = function() {
            if (m && m.readyState === 4 && (m.status !== 0 || m.responseURL && m.responseURL.indexOf("file:") === 0)) {
              var w = "getAllResponseHeaders" in m ? u(m.getAllResponseHeaders()) : null, _ = c.responseType && c.responseType !== "text" ? m.response : m.responseText, g = { data: _, status: m.status, statusText: m.statusText, headers: w, config: c, request: m };
              o(f, v, g), m = null;
            }
          }, m.onabort = function() {
            m && (v(l("Request aborted", c, "ECONNABORTED", m)), m = null);
          }, m.onerror = function() {
            v(l("Network Error", c, null, m)), m = null;
          }, m.ontimeout = function() {
            var w = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (w = c.timeoutErrorMessage), v(l(w, c, "ECONNABORTED", m)), m = null;
          }, n.isStandardBrowserEnv()) {
            var C = (c.withCredentials || a(O)) && c.xsrfCookieName ? r.read(c.xsrfCookieName) : void 0;
            C && (h[c.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in m && n.forEach(h, function(w, _) {
            typeof p > "u" && _.toLowerCase() === "content-type" ? delete h[_] : m.setRequestHeader(_, w);
          }), n.isUndefined(c.withCredentials) || (m.withCredentials = !!c.withCredentials), c.responseType) try {
            m.responseType = c.responseType;
          } catch (w) {
            if (c.responseType !== "json") throw w;
          }
          typeof c.onDownloadProgress == "function" && m.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && m.upload && m.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(w) {
            m && (m.abort(), v(w), m = null);
          }), p || (p = null), m.send(p);
        });
      };
    }, b575: function(i, d, e) {
      var n, o, r, t, s, u, a, l, c = e("da84"), f = e("06cf").f, v = e("2cf4").set, p = e("1cdc"), h = e("a4b4"), m = e("605d"), y = c.MutationObserver || c.WebKitMutationObserver, b = c.document, O = c.process, C = c.Promise, w = f(c, "queueMicrotask"), _ = w && w.value;
      _ || (n = function() {
        var g, S;
        for (m && (g = O.domain) && g.exit(); o; ) {
          S = o.fn, o = o.next;
          try {
            S();
          } catch (j) {
            throw o ? t() : r = void 0, j;
          }
        }
        r = void 0, g && g.enter();
      }, p || m || h || !y || !b ? C && C.resolve ? (a = C.resolve(void 0), l = a.then, t = function() {
        l.call(a, n);
      }) : t = m ? function() {
        O.nextTick(n);
      } : function() {
        v.call(c, n);
      } : (s = !0, u = b.createTextNode(""), new y(n).observe(u, { characterData: !0 }), t = function() {
        u.data = s = !s;
      })), i.exports = _ || function(g) {
        var S = { fn: g, next: void 0 };
        r && (r.next = S), o || (o = S, t()), r = S;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), s = e("4930"), u = e("fdbf"), a = o("wks"), l = n.Symbol, c = u ? l : l && l.withoutSetter || t;
      i.exports = function(f) {
        return r(a, f) && (s || typeof a[f] == "string") || (s && r(l, f) ? a[f] = l[f] : a[f] = c("Symbol." + f)), a[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), s = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: s }, { keys: function(u) {
        return r(o(u));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), s = e("d039"), u = 1 .toFixed, a = Math.floor, l = function(m, y, b) {
        return y === 0 ? b : y % 2 === 1 ? l(m, y - 1, b * m) : l(m * m, y / 2, b);
      }, c = function(m) {
        for (var y = 0, b = m; b >= 4096; ) y += 12, b /= 4096;
        for (; b >= 2; ) y += 1, b /= 2;
        return y;
      }, f = function(m, y, b) {
        for (var O = -1, C = b; ++O < 6; ) C += y * m[O], m[O] = C % 1e7, C = a(C / 1e7);
      }, v = function(m, y) {
        for (var b = 6, O = 0; --b >= 0; ) O += m[b], m[b] = a(O / y), O = O % y * 1e7;
      }, p = function(m) {
        for (var y = 6, b = ""; --y >= 0; ) if (b !== "" || y === 0 || m[y] !== 0) {
          var O = String(m[y]);
          b = b === "" ? O : b + t.call("0", 7 - O.length) + O;
        }
        return b;
      }, h = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !s(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: h }, { toFixed: function(m) {
        var y, b, O, C, w = r(this), _ = o(m), g = [0, 0, 0, 0, 0, 0], S = "", j = "0";
        if (_ < 0 || _ > 20) throw RangeError("Incorrect fraction digits");
        if (w != w) return "NaN";
        if (w <= -1e21 || w >= 1e21) return String(w);
        if (w < 0 && (S = "-", w = -w), w > 1e-21) if (y = c(w * l(2, 69, 1)) - 69, b = y < 0 ? w * l(2, -y, 1) : w / l(2, y, 1), b *= 4503599627370496, y = 52 - y, y > 0) {
          for (f(g, 0, b), O = _; O >= 7; ) f(g, 1e7, 0), O -= 7;
          for (f(g, l(10, O, 1), 0), O = y - 1; O >= 23; ) v(g, 1 << 23), O -= 23;
          v(g, 1 << O), f(g, 1, 1), v(g, 2), j = p(g);
        } else f(g, 0, b), f(g, 1 << -y, 0), j = p(g) + t.call("0", _);
        return _ > 0 ? (C = j.length, j = S + (C <= _ ? "0." + t.call("0", _ - C) + j : j.slice(0, C - _) + "." + j.slice(C - _))) : j = S + j, j;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), s = e("65f0"), u = [].push, a = function(l) {
        var c = l == 1, f = l == 2, v = l == 3, p = l == 4, h = l == 6, m = l == 7, y = l == 5 || h;
        return function(b, O, C, w) {
          for (var _, g, S = r(b), j = o(S), L = n(O, C, 3), E = t(j.length), M = 0, V = w || s, J = c ? V(b, E) : f || m ? V(b, 0) : void 0; E > M; M++) if ((y || M in j) && (_ = j[M], g = L(_, M, S), l)) if (c) J[M] = g;
          else if (g) switch (l) {
            case 3:
              return !0;
            case 5:
              return _;
            case 6:
              return M;
            case 2:
              u.call(J, _);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              u.call(J, _);
          }
          return h ? -1 : v || p ? p : J;
        };
      };
      i.exports = { forEach: a(0), map: a(1), filter: a(2), some: a(3), every: a(4), find: a(5), findIndex: a(6), filterOut: a(7) };
    }, b8d6: function(i, d, e) {
    }, bb2f: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(i, d, e) {
      i.exports = e("cee4");
    }, c04e: function(i, d, e) {
      var n = e("861d");
      i.exports = function(o, r) {
        if (!n(o)) return o;
        var t, s;
        if (r && typeof (t = o.toString) == "function" && !n(s = t.call(o)) || typeof (t = o.valueOf) == "function" && !n(s = t.call(o)) || !r && typeof (t = o.toString) == "function" && !n(s = t.call(o))) return s;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, d, e) {
      var n = e("c532"), o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(r) {
        var t, s, u, a = {};
        return r && n.forEach(r.split(`
`), function(l) {
          if (u = l.indexOf(":"), t = n.trim(l.substr(0, u)).toLowerCase(), s = n.trim(l.substr(u + 1)), t) {
            if (a[t] && o.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([s]) : a[t] ? a[t] + ", " + s : s;
          }
        }), a;
      };
    }, c401: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r, t) {
        return n.forEach(t, function(s) {
          o = s(o, r);
        }), o;
      };
    }, c430: function(i, d) {
      i.exports = !1;
    }, c532: function(i, d, e) {
      var n = e("1d2b"), o = Object.prototype.toString;
      function r(E) {
        return o.call(E) === "[object Array]";
      }
      function t(E) {
        return typeof E > "u";
      }
      function s(E) {
        return E !== null && !t(E) && E.constructor !== null && !t(E.constructor) && typeof E.constructor.isBuffer == "function" && E.constructor.isBuffer(E);
      }
      function u(E) {
        return o.call(E) === "[object ArrayBuffer]";
      }
      function a(E) {
        return typeof FormData < "u" && E instanceof FormData;
      }
      function l(E) {
        var M;
        return M = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(E) : E && E.buffer && E.buffer instanceof ArrayBuffer, M;
      }
      function c(E) {
        return typeof E == "string";
      }
      function f(E) {
        return typeof E == "number";
      }
      function v(E) {
        return E !== null && typeof E == "object";
      }
      function p(E) {
        if (o.call(E) !== "[object Object]") return !1;
        var M = Object.getPrototypeOf(E);
        return M === null || M === Object.prototype;
      }
      function h(E) {
        return o.call(E) === "[object Date]";
      }
      function m(E) {
        return o.call(E) === "[object File]";
      }
      function y(E) {
        return o.call(E) === "[object Blob]";
      }
      function b(E) {
        return o.call(E) === "[object Function]";
      }
      function O(E) {
        return v(E) && b(E.pipe);
      }
      function C(E) {
        return typeof URLSearchParams < "u" && E instanceof URLSearchParams;
      }
      function w(E) {
        return E.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function _() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function g(E, M) {
        if (E !== null && typeof E < "u") if (typeof E != "object" && (E = [E]), r(E)) for (var V = 0, J = E.length; V < J; V++) M.call(null, E[V], V, E);
        else for (var ie in E) Object.prototype.hasOwnProperty.call(E, ie) && M.call(null, E[ie], ie, E);
      }
      function S() {
        var E = {};
        function M(ie, H) {
          p(E[H]) && p(ie) ? E[H] = S(E[H], ie) : p(ie) ? E[H] = S({}, ie) : r(ie) ? E[H] = ie.slice() : E[H] = ie;
        }
        for (var V = 0, J = arguments.length; V < J; V++) g(arguments[V], M);
        return E;
      }
      function j(E, M, V) {
        return g(M, function(J, ie) {
          E[ie] = V && typeof J == "function" ? n(J, V) : J;
        }), E;
      }
      function L(E) {
        return E.charCodeAt(0) === 65279 && (E = E.slice(1)), E;
      }
      i.exports = { isArray: r, isArrayBuffer: u, isBuffer: s, isFormData: a, isArrayBufferView: l, isString: c, isNumber: f, isObject: v, isPlainObject: p, isUndefined: t, isDate: h, isFile: m, isBlob: y, isFunction: b, isStream: O, isURLSearchParams: C, isStandardBrowserEnv: _, forEach: g, merge: S, extend: j, trim: w, stripBOM: L };
    }, c6b6: function(i, d) {
      var e = {}.toString;
      i.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(i, d, e) {
      var n = e("da84"), o = e("ce4e"), r = "__core-js_shared__", t = n[r] || o(r, {});
      i.exports = t;
    }, c8af: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r) {
        n.forEach(o, function(t, s) {
          s !== r && s.toUpperCase() === r.toUpperCase() && (o[r] = t, delete o[s]);
        });
      };
    }, c8ba: function(i, d) {
      var e;
      e = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        e = e || new Function("return this")();
      } catch {
        typeof window == "object" && (e = window);
      }
      i.exports = e;
    }, ca84: function(i, d, e) {
      var n = e("5135"), o = e("fc6a"), r = e("4d64").indexOf, t = e("d012");
      i.exports = function(s, u) {
        var a, l = o(s), c = 0, f = [];
        for (a in l) !n(t, a) && n(l, a) && f.push(a);
        for (; u.length > c; ) n(l, a = u[c++]) && (~r(f, a) || f.push(a));
        return f;
      };
    }, caad: function(i, d, e) {
      var n = e("23e7"), o = e("4d64").includes, r = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), r("includes");
    }, cc12: function(i, d, e) {
      var n = e("da84"), o = e("861d"), r = n.document, t = o(r) && o(r.createElement);
      i.exports = function(s) {
        return t ? r.createElement(s) : {};
      };
    }, cdf9: function(i, d, e) {
      var n = e("825a"), o = e("861d"), r = e("f069");
      i.exports = function(t, s) {
        if (n(t), o(s) && s.constructor === t) return s;
        var u = r.f(t), a = u.resolve;
        return a(s), u.promise;
      };
    }, ce4e: function(i, d, e) {
      var n = e("da84"), o = e("9112");
      i.exports = function(r, t) {
        try {
          o(n, r, t);
        } catch {
          n[r] = t;
        }
        return t;
      };
    }, cee4: function(i, d, e) {
      var n = e("c532"), o = e("1d2b"), r = e("0a06"), t = e("4a7b"), s = e("2444");
      function u(l) {
        var c = new r(l), f = o(r.prototype.request, c);
        return n.extend(f, r.prototype, c), n.extend(f, c), f;
      }
      var a = u(s);
      a.Axios = r, a.create = function(l) {
        return u(t(a.defaults, l));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(l) {
        return Promise.all(l);
      }, a.spread = e("0df6"), a.isAxiosError = e("5f02"), i.exports = a, i.exports.default = a;
    }, d012: function(i, d) {
      i.exports = {};
    }, d039: function(i, d) {
      i.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(i, d, e) {
      var n = e("428f"), o = e("da84"), r = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, s) {
        return arguments.length < 2 ? r(n[t]) || r(o[t]) : n[t] && n[t][s] || o[t] && o[t][s];
      };
    }, d1e7: function(i, d, e) {
      var n = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, r = o && !n.call({ 1: 2 }, 1);
      d.f = r ? function(t) {
        var s = o(this, t);
        return !!s && s.enumerable;
      } : n;
    }, d28b: function(i, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, d, e) {
      var n = e("825a"), o = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var r, t = !1, s = {};
        try {
          r = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, r.call(s, []), t = s instanceof Array;
        } catch {
        }
        return function(u, a) {
          return n(u), o(a), t ? r.call(u, a) : u.__proto__ = a, u;
        };
      }() : void 0);
    }, d3b7: function(i, d, e) {
      var n = e("00ee"), o = e("6eeb"), r = e("b041");
      n || o(Object.prototype, "toString", r, { unsafe: !0 });
    }, d40d: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
<style type="text/css">\r
	#icon-back .st0{stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}\r
	#icon-back .st1{stroke-width:2.1499;stroke-miterlimit:10;}\r
	#icon-back .st2{stroke-width:3.2571;stroke-miterlimit:10;}\r
</style>\r
<g>\r
	<path class="st0" d="M8.4,8.8h37.1c6.7,0,12.2,5.4,12.2,12.2l0,0c0,7.2-5.8,13.1-13.1,13.1c0,0,0,0,0,0h-24" />\r
	<g>\r
		<path class="st1" d="M3,9.1l8.6,6.9c0.1,0.1,0.3,0,0.3-0.1V2c0-0.2-0.2-0.2-0.3-0.1L3,8.8C2.9,8.9,2.9,9,3,9.1z" />\r
		<path class="st2" d="M10.4,4.8c0,0-5.4,4.1-5.4,4s5.6,3.8,5.6,3.8L10.4,4.8z" />\r
	</g>\r
</g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, d44e: function(i, d, e) {
      var n = e("9bf2").f, o = e("5135"), r = e("b622"), t = r("toStringTag");
      i.exports = function(s, u, a) {
        s && !o(s = a ? s : s.prototype, t) && n(s, t, { configurable: !0, value: u });
      };
    }, d58f: function(i, d, e) {
      var n = e("1c0b"), o = e("7b0b"), r = e("44ad"), t = e("50c4"), s = function(u) {
        return function(a, l, c, f) {
          n(l);
          var v = o(a), p = r(v), h = t(v.length), m = u ? h - 1 : 0, y = u ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (m in p) {
              f = p[m], m += y;
              break;
            }
            if (m += y, u ? m < 0 : h <= m) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? m >= 0 : h > m; m += y) m in p && (f = l(f, p[m], m, v));
          return f;
        };
      };
      i.exports = { left: s(!1), right: s(!0) };
    }, d69c: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, d784: function(i, d, e) {
      e("ac1f");
      var n = e("6eeb"), o = e("d039"), r = e("b622"), t = e("9263"), s = e("9112"), u = r("species"), a = !o(function() {
        var p = /./;
        return p.exec = function() {
          var h = [];
          return h.groups = { a: "7" }, h;
        }, "".replace(p, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), c = r("replace"), f = function() {
        return !!/./[c] && /./[c]("a", "$0") === "";
      }(), v = !o(function() {
        var p = /(?:)/, h = p.exec;
        p.exec = function() {
          return h.apply(this, arguments);
        };
        var m = "ab".split(p);
        return m.length !== 2 || m[0] !== "a" || m[1] !== "b";
      });
      i.exports = function(p, h, m, y) {
        var b = r(p), O = !o(function() {
          var j = {};
          return j[b] = function() {
            return 7;
          }, ""[p](j) != 7;
        }), C = O && !o(function() {
          var j = !1, L = /a/;
          return p === "split" && (L = {}, L.constructor = {}, L.constructor[u] = function() {
            return L;
          }, L.flags = "", L[b] = /./[b]), L.exec = function() {
            return j = !0, null;
          }, L[b](""), !j;
        });
        if (!O || !C || p === "replace" && (!a || !l || f) || p === "split" && !v) {
          var w = /./[b], _ = m(b, ""[p], function(j, L, E, M, V) {
            return L.exec === t ? O && !V ? { done: !0, value: w.call(L, E, M) } : { done: !0, value: j.call(E, L, M) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), g = _[0], S = _[1];
          n(String.prototype, p, g), n(RegExp.prototype, b, h == 2 ? function(j, L) {
            return S.call(j, this, L);
          } : function(j) {
            return S.call(j, this);
          });
        }
        y && s(RegExp.prototype[b], "sham", !0);
      };
    }, d81d: function(i, d, e) {
      var n = e("23e7"), o = e("b727").map, r = e("1dde"), t = r("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(s) {
        return o(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(i, d, e) {
      i.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(i, d, e) {
      (function(n) {
        var o = function(r) {
          return r && r.Math == Math && r;
        };
        i.exports = o(typeof globalThis == "object" && globalThis) || o(typeof window == "object" && window) || o(typeof self == "object" && self) || o(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("56ef"), t = e("fc6a"), s = e("06cf"), u = e("8418");
      n({ target: "Object", stat: !0, sham: !o }, { getOwnPropertyDescriptors: function(a) {
        for (var l, c, f = t(a), v = s.f, p = r(f), h = {}, m = 0; p.length > m; ) c = v(f, l = p[m++]), c !== void 0 && u(h, l, c);
        return h;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), s = e("b622"), u = s("iterator"), a = s("toStringTag"), l = r.values;
      for (var c in o) {
        var f = n[c], v = f && f.prototype;
        if (v) {
          if (v[u] !== l) try {
            t(v, u, l);
          } catch {
            v[u] = l;
          }
          if (v[a] || t(v, a, c), o[c]) {
            for (var p in r) if (v[p] !== r[p]) try {
              t(v, p, r[p]);
            } catch {
              v[p] = r[p];
            }
          }
        }
      }
    }, de23: function(i, d, e) {
      e("7305");
    }, df75: function(i, d, e) {
      var n = e("ca84"), o = e("7839");
      i.exports = Object.keys || function(r) {
        return n(r, o);
      };
    }, df7c: function(i, d, e) {
      (function(n) {
        function o(u, a) {
          for (var l = 0, c = u.length - 1; c >= 0; c--) {
            var f = u[c];
            f === "." ? u.splice(c, 1) : f === ".." ? (u.splice(c, 1), l++) : l && (u.splice(c, 1), l--);
          }
          if (a) for (; l--; l) u.unshift("..");
          return u;
        }
        function r(u) {
          typeof u != "string" && (u += "");
          var a, l = 0, c = -1, f = !0;
          for (a = u.length - 1; a >= 0; --a) if (u.charCodeAt(a) === 47) {
            if (!f) {
              l = a + 1;
              break;
            }
          } else c === -1 && (f = !1, c = a + 1);
          return c === -1 ? "" : u.slice(l, c);
        }
        function t(u, a) {
          if (u.filter) return u.filter(a);
          for (var l = [], c = 0; c < u.length; c++) a(u[c], c, u) && l.push(u[c]);
          return l;
        }
        d.resolve = function() {
          for (var u = "", a = !1, l = arguments.length - 1; l >= -1 && !a; l--) {
            var c = l >= 0 ? arguments[l] : n.cwd();
            if (typeof c != "string") throw new TypeError("Arguments to path.resolve must be strings");
            c && (u = c + "/" + u, a = c.charAt(0) === "/");
          }
          return u = o(t(u.split("/"), function(f) {
            return !!f;
          }), !a).join("/"), (a ? "/" : "") + u || ".";
        }, d.normalize = function(u) {
          var a = d.isAbsolute(u), l = s(u, -1) === "/";
          return u = o(t(u.split("/"), function(c) {
            return !!c;
          }), !a).join("/"), u || a || (u = "."), u && l && (u += "/"), (a ? "/" : "") + u;
        }, d.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, d.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(u, function(a, l) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, d.relative = function(u, a) {
          function l(y) {
            for (var b = 0; b < y.length && y[b] === ""; b++) ;
            for (var O = y.length - 1; O >= 0 && y[O] === ""; O--) ;
            return b > O ? [] : y.slice(b, O - b + 1);
          }
          u = d.resolve(u).substr(1), a = d.resolve(a).substr(1);
          for (var c = l(u.split("/")), f = l(a.split("/")), v = Math.min(c.length, f.length), p = v, h = 0; h < v; h++) if (c[h] !== f[h]) {
            p = h;
            break;
          }
          var m = [];
          for (h = p; h < c.length; h++) m.push("..");
          return m = m.concat(f.slice(p)), m.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var a = u.charCodeAt(0), l = a === 47, c = -1, f = !0, v = u.length - 1; v >= 1; --v) if (a = u.charCodeAt(v), a === 47) {
            if (!f) {
              c = v;
              break;
            }
          } else f = !1;
          return c === -1 ? l ? "/" : "." : l && c === 1 ? "/" : u.slice(0, c);
        }, d.basename = function(u, a) {
          var l = r(u);
          return a && l.substr(-1 * a.length) === a && (l = l.substr(0, l.length - a.length)), l;
        }, d.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var a = -1, l = 0, c = -1, f = !0, v = 0, p = u.length - 1; p >= 0; --p) {
            var h = u.charCodeAt(p);
            if (h !== 47) c === -1 && (f = !1, c = p + 1), h === 46 ? a === -1 ? a = p : v !== 1 && (v = 1) : a !== -1 && (v = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return a === -1 || c === -1 || v === 0 || v === 1 && a === c - 1 && a === l + 1 ? "" : u.slice(a, c);
        };
        var s = "ab".substr(-1) === "b" ? function(u, a, l) {
          return u.substr(a, l);
        } : function(u, a, l) {
          return a < 0 && (a = u.length + a), u.substr(a, l);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(h) {
            var m = h.id, y = h.viewBox, b = h.content;
            this.id = m, this.viewBox = y, this.content = b;
          };
          o.prototype.stringify = function() {
            return this.content;
          }, o.prototype.toString = function() {
            return this.stringify();
          }, o.prototype.destroy = function() {
            var h = this;
            ["id", "viewBox", "content"].forEach(function(m) {
              return delete h[m];
            });
          };
          var r = function(h) {
            var m = !!document.importNode, y = new DOMParser().parseFromString(h, "image/svg+xml").documentElement;
            return m ? document.importNode(y, !0) : y;
          };
          function t(h, m) {
            return m = { exports: {} }, h(m, m.exports), m.exports;
          }
          var s = t(function(h, m) {
            (function(y, b) {
              h.exports = b();
            })(0, function() {
              function y(g) {
                var S = g && typeof g == "object";
                return S && Object.prototype.toString.call(g) !== "[object RegExp]" && Object.prototype.toString.call(g) !== "[object Date]";
              }
              function b(g) {
                return Array.isArray(g) ? [] : {};
              }
              function O(g, S) {
                var j = S && S.clone === !0;
                return j && y(g) ? _(b(g), g, S) : g;
              }
              function C(g, S, j) {
                var L = g.slice();
                return S.forEach(function(E, M) {
                  typeof L[M] > "u" ? L[M] = O(E, j) : y(E) ? L[M] = _(g[M], E, j) : g.indexOf(E) === -1 && L.push(O(E, j));
                }), L;
              }
              function w(g, S, j) {
                var L = {};
                return y(g) && Object.keys(g).forEach(function(E) {
                  L[E] = O(g[E], j);
                }), Object.keys(S).forEach(function(E) {
                  y(S[E]) && g[E] ? L[E] = _(g[E], S[E], j) : L[E] = O(S[E], j);
                }), L;
              }
              function _(g, S, j) {
                var L = Array.isArray(S), E = j || { arrayMerge: C }, M = E.arrayMerge || C;
                return L ? Array.isArray(g) ? M(g, S, j) : O(S, j) : w(g, S, j);
              }
              return _.all = function(g, S) {
                if (!Array.isArray(g) || g.length < 2) throw new Error("first argument should be an array with at least two elements");
                return g.reduce(function(j, L) {
                  return _(j, L, S);
                });
              }, _;
            });
          }), u = t(function(h, m) {
            var y = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            m.default = y, h.exports = m.default;
          }), a = function(h) {
            return Object.keys(h).map(function(m) {
              var y = h[m].toString().replace(/"/g, "&quot;");
              return m + '="' + y + '"';
            }).join(" ");
          }, l = u.svg, c = u.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var v = function(h, m) {
            h === void 0 && (h = "");
            var y = s(f, {}), b = a(y);
            return "<svg " + b + ">" + h + "</svg>";
          }, p = function(h) {
            function m() {
              h.apply(this, arguments);
            }
            h && (m.__proto__ = h), m.prototype = Object.create(h && h.prototype), m.prototype.constructor = m;
            var y = { isMounted: {} };
            return y.isMounted.get = function() {
              return !!this.node;
            }, m.createFromExistingNode = function(b) {
              return new m({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, m.prototype.destroy = function() {
              this.isMounted && this.unmount(), h.prototype.destroy.call(this);
            }, m.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var O = typeof b == "string" ? document.querySelector(b) : b, C = this.render();
              return this.node = C, O.appendChild(C), C;
            }, m.prototype.render = function() {
              var b = this.stringify();
              return r(v(b)).childNodes[0];
            }, m.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(m.prototype, y), m;
          }(o);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), s = e("861d"), u = e("9bf2").f, a = e("e893"), l = r.Symbol;
      if (o && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var y = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof f ? new l(y) : y === void 0 ? l() : l(y);
          return y === "" && (c[b] = !0), b;
        };
        a(f, l);
        var v = f.prototype = l.prototype;
        v.constructor = f;
        var p = v.toString, h = String(l("test")) == "Symbol(test)", m = /^Symbol\((.*)\)[^)]+$/;
        u(v, "description", { configurable: !0, get: function() {
          var y = s(this) ? this.valueOf() : this, b = p.call(y);
          if (t(c, y)) return "";
          var O = h ? b.slice(7, -1) : b.replace(m, "$1");
          return O === "" ? void 0 : O;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(i, d, e) {
      var n = e("5135"), o = e("7b0b"), r = e("f772"), t = e("e177"), s = r("IE_PROTO"), u = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(a) {
        return a = o(a), n(a, s) ? a[s] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? u : null;
      };
    }, e177: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function o() {
        }
        return o.prototype.constructor = null, Object.getPrototypeOf(new o()) !== o.prototype;
      });
    }, e260: function(i, d, e) {
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), s = e("7dd0"), u = "Array Iterator", a = t.set, l = t.getterFor(u);
      i.exports = s(Array, "Array", function(c, f) {
        a(this, { type: u, target: n(c), index: 0, kind: f });
      }, function() {
        var c = l(this), f = c.target, v = c.kind, p = c.index++;
        return !f || p >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : v == "keys" ? { value: p, done: !1 } : v == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), r.Arguments = r.Array, o("keys"), o("values"), o("entries");
    }, e2cc: function(i, d, e) {
      var n = e("6eeb");
      i.exports = function(o, r, t) {
        for (var s in r) n(o, s, r[s], t);
        return o;
      };
    }, e439: function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("fc6a"), t = e("06cf").f, s = e("83ab"), u = o(function() {
        t(1);
      }), a = !s || u;
      n({ target: "Object", stat: !0, forced: a, sham: !s }, { getOwnPropertyDescriptor: function(l, c) {
        return t(r(l), c);
      } });
    }, e538: function(i, d, e) {
      var n = e("b622");
      d.f = n;
    }, e667: function(i, d) {
      i.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(i, d, e) {
      e("95d9");
    }, e683: function(i, d, e) {
      i.exports = function(n, o) {
        return o ? n.replace(/\/+$/, "") + "/" + o.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(i, d, e) {
      var n, o, r, t, s = e("23e7"), u = e("c430"), a = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), v = e("e2cc"), p = e("d44e"), h = e("2626"), m = e("861d"), y = e("1c0b"), b = e("19aa"), O = e("8925"), C = e("2266"), w = e("1c7e"), _ = e("4840"), g = e("2cf4").set, S = e("b575"), j = e("cdf9"), L = e("44de"), E = e("f069"), M = e("e667"), V = e("69f3"), J = e("94ca"), ie = e("b622"), H = e("605d"), W = e("2d00"), F = ie("species"), T = "Promise", A = V.get, Q = V.set, Z = V.getterFor(T), U = c, _e = a.TypeError, ve = a.document, Le = a.process, Be = l("fetch"), Re = E.f, Ae = Re, Ne = !!(ve && ve.createEvent && a.dispatchEvent), We = typeof PromiseRejectionEvent == "function", Ze = "unhandledrejection", B = "rejectionhandled", $ = 0, ee = 1, D = 2, ne = 1, re = 2, ke = J(T, function() {
        var z = O(U) !== String(U);
        if (!z && (W === 66 || !H && !We) || u && !U.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(U)) return !1;
        var ae = U.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, me = ae.constructor = {};
        return me[F] = fe, !(ae.then(function() {
        }) instanceof fe);
      }), he = ke || !w(function(z) {
        U.all(z).catch(function() {
        });
      }), se = function(z) {
        var ae;
        return !(!m(z) || typeof (ae = z.then) != "function") && ae;
      }, Se = function(z, ae) {
        if (!z.notified) {
          z.notified = !0;
          var fe = z.reactions;
          S(function() {
            for (var me = z.value, q = z.state == ee, oe = 0; fe.length > oe; ) {
              var ce, ge, De, ze = fe[oe++], it = q ? ze.ok : ze.fail, Ee = ze.resolve, at = ze.reject, He = ze.domain;
              try {
                it ? (q || (z.rejection === re && X(z), z.rejection = ne), it === !0 ? ce = me : (He && He.enter(), ce = it(me), He && (He.exit(), De = !0)), ce === ze.promise ? at(_e("Promise-chain cycle")) : (ge = se(ce)) ? ge.call(ce, Ee, at) : Ee(ce)) : at(me);
              } catch (wt) {
                He && !De && He.exit(), at(wt);
              }
            }
            z.reactions = [], z.notified = !1, ae && !z.rejection && le(z);
          });
        }
      }, Oe = function(z, ae, fe) {
        var me, q;
        Ne ? (me = ve.createEvent("Event"), me.promise = ae, me.reason = fe, me.initEvent(z, !1, !0), a.dispatchEvent(me)) : me = { promise: ae, reason: fe }, !We && (q = a["on" + z]) ? q(me) : z === Ze && L("Unhandled promise rejection", fe);
      }, le = function(z) {
        g.call(a, function() {
          var ae, fe = z.facade, me = z.value, q = I(z);
          if (q && (ae = M(function() {
            H ? Le.emit("unhandledRejection", me, fe) : Oe(Ze, fe, me);
          }), z.rejection = H || I(z) ? re : ne, ae.error)) throw ae.value;
        });
      }, I = function(z) {
        return z.rejection !== ne && !z.parent;
      }, X = function(z) {
        g.call(a, function() {
          var ae = z.facade;
          H ? Le.emit("rejectionHandled", ae) : Oe(B, ae, z.value);
        });
      }, Ve = function(z, ae, fe) {
        return function(me) {
          z(ae, me, fe);
        };
      }, rt = function(z, ae, fe) {
        z.done || (z.done = !0, fe && (z = fe), z.value = ae, z.state = D, Se(z, !0));
      }, dt = function(z, ae, fe) {
        if (!z.done) {
          z.done = !0, fe && (z = fe);
          try {
            if (z.facade === ae) throw _e("Promise can't be resolved itself");
            var me = se(ae);
            me ? S(function() {
              var q = { done: !1 };
              try {
                me.call(ae, Ve(dt, q, z), Ve(rt, q, z));
              } catch (oe) {
                rt(q, oe, z);
              }
            }) : (z.value = ae, z.state = ee, Se(z, !1));
          } catch (q) {
            rt({ done: !1 }, q, z);
          }
        }
      };
      ke && (U = function(z) {
        b(this, U, T), y(z), n.call(this);
        var ae = A(this);
        try {
          z(Ve(dt, ae), Ve(rt, ae));
        } catch (fe) {
          rt(ae, fe);
        }
      }, n = function(z) {
        Q(this, { type: T, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: $, value: void 0 });
      }, n.prototype = v(U.prototype, { then: function(z, ae) {
        var fe = Z(this), me = Re(_(this, U));
        return me.ok = typeof z != "function" || z, me.fail = typeof ae == "function" && ae, me.domain = H ? Le.domain : void 0, fe.parent = !0, fe.reactions.push(me), fe.state != $ && Se(fe, !1), me.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), o = function() {
        var z = new n(), ae = A(z);
        this.promise = z, this.resolve = Ve(dt, ae), this.reject = Ve(rt, ae);
      }, E.f = Re = function(z) {
        return z === U || z === r ? new o(z) : Ae(z);
      }, u || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(z, ae) {
        var fe = this;
        return new U(function(me, q) {
          t.call(fe, me, q);
        }).then(z, ae);
      }, { unsafe: !0 }), typeof Be == "function" && s({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return j(U, Be.apply(a, arguments));
      } }))), s({ global: !0, wrap: !0, forced: ke }, { Promise: U }), p(U, T, !1, !0), h(T), r = l(T), s({ target: T, stat: !0, forced: ke }, { reject: function(z) {
        var ae = Re(this);
        return ae.reject.call(void 0, z), ae.promise;
      } }), s({ target: T, stat: !0, forced: u || ke }, { resolve: function(z) {
        return j(u && this === r ? U : this, z);
      } }), s({ target: T, stat: !0, forced: he }, { all: function(z) {
        var ae = this, fe = Re(ae), me = fe.resolve, q = fe.reject, oe = M(function() {
          var ce = y(ae.resolve), ge = [], De = 0, ze = 1;
          C(z, function(it) {
            var Ee = De++, at = !1;
            ge.push(void 0), ze++, ce.call(ae, it).then(function(He) {
              at || (at = !0, ge[Ee] = He, --ze || me(ge));
            }, q);
          }), --ze || me(ge);
        });
        return oe.error && q(oe.value), fe.promise;
      }, race: function(z) {
        var ae = this, fe = Re(ae), me = fe.reject, q = M(function() {
          var oe = y(ae.resolve);
          C(z, function(ce) {
            oe.call(ae, ce).then(fe.resolve, me);
          });
        });
        return q.error && me(q.value), fe.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(s, u) {
        for (var a = o(u), l = t.f, c = r.f, f = 0; f < a.length; f++) {
          var v = a[f];
          n(s, v) || l(s, v, c(u, v));
        }
      };
    }, e8b5: function(i, d, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(o) {
        return n(o) == "Array";
      };
    }, e95a: function(i, d, e) {
      var n = e("b622"), o = e("3f8c"), r = n("iterator"), t = Array.prototype;
      i.exports = function(s) {
        return s !== void 0 && (o.Array === s || t[r] === s);
      };
    }, ec57: function(i, d, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function o(t) {
        var s = r(t);
        return e(s);
      }
      function r(t) {
        if (!e.o(n, t)) {
          var s = new Error("Cannot find module '" + t + "'");
          throw s.code = "MODULE_NOT_FOUND", s;
        }
        return n[t];
      }
      o.keys = function() {
        return Object.keys(n);
      }, o.resolve = r, i.exports = o, o.id = "ec57";
    }, f069: function(i, d, e) {
      var n = e("1c0b"), o = function(r) {
        var t, s;
        this.promise = new r(function(u, a) {
          if (t !== void 0 || s !== void 0) throw TypeError("Bad Promise constructor");
          t = u, s = a;
        }), this.resolve = n(t), this.reject = n(s);
      };
      i.exports.f = function(r) {
        return new o(r);
      };
    }, f183: function(i, d, e) {
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, s = e("90e3"), u = e("bb2f"), a = s("meta"), l = 0, c = Object.isExtensible || function() {
        return !0;
      }, f = function(y) {
        t(y, a, { value: { objectID: "O" + ++l, weakData: {} } });
      }, v = function(y, b) {
        if (!o(y)) return typeof y == "symbol" ? y : (typeof y == "string" ? "S" : "P") + y;
        if (!r(y, a)) {
          if (!c(y)) return "F";
          if (!b) return "E";
          f(y);
        }
        return y[a].objectID;
      }, p = function(y, b) {
        if (!r(y, a)) {
          if (!c(y)) return !0;
          if (!b) return !1;
          f(y);
        }
        return y[a].weakData;
      }, h = function(y) {
        return u && m.REQUIRED && c(y) && !r(y, a) && f(y), y;
      }, m = i.exports = { REQUIRED: !1, fastKey: v, getWeakData: p, onFreeze: h };
      n[a] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), s = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(a, l) {
        try {
          return a[l];
        } catch {
        }
      };
      i.exports = n ? o : function(a) {
        var l, c, f;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (c = u(l = Object(a), t)) == "string" ? c : s ? o(l) : (f = o(l)) == "Object" && typeof l.callee == "function" ? "Arguments" : f;
      };
    }, f6b4: function(i, d, e) {
      var n = e("c532");
      function o() {
        this.handlers = [];
      }
      o.prototype.use = function(r, t) {
        return this.handlers.push({ fulfilled: r, rejected: t }), this.handlers.length - 1;
      }, o.prototype.eject = function(r) {
        this.handlers[r] && (this.handlers[r] = null);
      }, o.prototype.forEach = function(r) {
        n.forEach(this.handlers, function(t) {
          t !== null && r(t);
        });
      }, i.exports = o;
    }, f772: function(i, d, e) {
      var n = e("5692"), o = e("90e3"), r = n("keys");
      i.exports = function(t) {
        return r[t] || (r[t] = o(t));
      };
    }, f8b0: function(i, d, e) {
      e("b8d6");
    }, fb15: function(i, d, e) {
      if (e.r(d), typeof window < "u") {
        var n = window.document.currentScript, o = e("8875");
        n = o(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: o });
        var r = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        r && (e.p = r[1]);
      }
      e("b0c0");
      var t = e("8bbf"), s = { class: "key-board-container" }, u = { class: "key-board-area" };
      function a(x, R, P, N, K, ue) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), ye = Object(t.resolveComponent)("HandBoard"), Ue = Object(t.resolveComponent)("svg-icon"), Fe = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: R[1] || (R[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", s, [Object(t.createVNode)(pe, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ye, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Ue, { "icon-class": "drag" })], 4)), [[Fe]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(x, R, P) {
        return R in x ? Object.defineProperty(x, R, { value: P, enumerable: !0, configurable: !0, writable: !0 }) : x[R] = P, x;
      }
      function c(x, R) {
        var P = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var N = Object.getOwnPropertySymbols(x);
          R && (N = N.filter(function(K) {
            return Object.getOwnPropertyDescriptor(x, K).enumerable;
          })), P.push.apply(P, N);
        }
        return P;
      }
      function f(x) {
        for (var R = 1; R < arguments.length; R++) {
          var P = arguments[R] != null ? arguments[R] : {};
          R % 2 ? c(Object(P), !0).forEach(function(N) {
            l(x, N, P[N]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(P)) : c(Object(P)).forEach(function(N) {
            Object.defineProperty(x, N, Object.getOwnPropertyDescriptor(P, N));
          });
        }
        return x;
      }
      function v(x, R) {
        (R == null || R > x.length) && (R = x.length);
        for (var P = 0, N = new Array(R); P < R; P++) N[P] = x[P];
        return N;
      }
      function p(x) {
        if (Array.isArray(x)) return v(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function h(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function m(x, R) {
        if (x) {
          if (typeof x == "string") return v(x, R);
          var P = Object.prototype.toString.call(x).slice(8, -1);
          return P === "Object" && x.constructor && (P = x.constructor.name), P === "Map" || P === "Set" ? Array.from(x) : P === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(P) ? v(x, R) : void 0;
        }
      }
      function y() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(x) {
        return p(x) || h(x) || m(x) || y();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function O(x, R) {
        if (!(x instanceof R)) throw new TypeError("Cannot call a class as a function");
      }
      function C(x, R) {
        for (var P = 0; P < R.length; P++) {
          var N = R[P];
          N.enumerable = N.enumerable || !1, N.configurable = !0, "value" in N && (N.writable = !0), Object.defineProperty(x, N.key, N);
        }
      }
      function w(x, R, P) {
        return R && C(x.prototype, R), x;
      }
      var _ = function() {
        function x() {
          O(this, x), this.listeners = {};
        }
        return w(x, [{ key: "on", value: function(R, P) {
          var N = this, K = this.listeners[R];
          return K || (K = []), K.push(P), this.listeners[R] = K, function() {
            N.remove(R, P);
          };
        } }, { key: "emit", value: function(R) {
          var P = this.listeners[R];
          if (Array.isArray(P)) {
            for (var N = arguments.length, K = new Array(N > 1 ? N - 1 : 0), ue = 1; ue < N; ue++) K[ue - 1] = arguments[ue];
            for (var pe = 0; pe < P.length; pe++) {
              var de = P[pe];
              typeof de == "function" && de.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function(R, P) {
          if (P) {
            var N = this.listeners[R];
            if (!N) return;
            N = N.filter(function(K) {
              return K !== P;
            }), this.listeners[R] = N;
          } else this.listeners[R] = null, delete this.listeners[R];
        } }]), x;
      }(), g = new _(), S = { mounted: function(x, R, P) {
        var N = x.parentNode;
        x.onmousedown = function(K) {
          var ue = K.clientX - N.offsetLeft, pe = K.clientY - N.offsetTop;
          document.onmousemove = function(de) {
            var ye = de.clientX - ue, Ue = de.clientY - pe;
            N.style.left = ye + "px", N.style.top = Ue + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              g.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(K) {
          var ue = K.touches[0].pageX, pe = K.touches[0].pageY, de = ue - N.offsetLeft, ye = pe - N.offsetTop;
          document.ontouchmove = function(Ue) {
            var Fe = Ue.touches[0].pageX, qe = Ue.touches[0].pageY, Ke = Fe - de, gt = qe - ye;
            N.style.left = Ke + "px", N.style.top = gt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              g.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, j = S, L = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var E = { key: 0, class: "key-board-code-show" }, M = { class: "key-board-result-show" }, V = { class: "key-board-result-show-container" }, J = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ie = L(function(x, R, P, N, K, ue) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", E, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", M, [Object(t.createVNode)("div", V, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(ye) {
            return x.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", J, [Object(t.createVNode)("span", { style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: R[2] || (R[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(x, R) {
        for (var P = 0, N = []; P < x.length; ) N.push(x.slice(P, P += R));
        return N;
      }), W = Symbol("KEYBOARD_CONTEXT"), F = function(x) {
        Object(t.provide)(W, x);
      }, T = function() {
        return Object(t.inject)(W);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, R) {
        var P = R.emit, N = T(), K = Object(t.computed)(function() {
          return { borderTopColor: N == null ? void 0 : N.color };
        }), ue = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function pe() {
          ue.showIndex !== 0 && (ue.showIndex -= 1);
        }
        function de() {
          ue.showIndex !== ue.showList.length - 1 && (ue.showIndex += 1);
        }
        function ye() {
          ue.showIndex = 0, ue.showList = [], ue.valueList = [], g.emit("resultReset");
        }
        function Ue(Fe) {
          ye(), P("change", Fe);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Fe) {
          var qe;
          ue.showIndex = 0, ue.valueList = (Fe == null || (qe = Fe.value) === null || qe === void 0 ? void 0 : qe.split("")) || [], ue.valueList.length !== 0 ? ue.showList = H(ue.valueList, 11) : ue.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          g.on("keyBoardChange", function(Fe) {
            g.emit("updateBound"), ue.status = Fe, ye();
          }), g.on("getWordsFromServer", function(Fe) {
            var qe = Array.from(new Set(Fe.replace(/\s+/g, "").split("")));
            ue.valueList = qe, ue.showList = H(qe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          g.remove("keyBoardChange"), g.remove("getWordsFromServer");
        }), f({ color: N == null ? void 0 : N.color, upper: pe, lower: de, getStyle: K, selectWord: Ue }, Object(t.toRefs)(ue));
      } });
      e("e66c"), A.render = ie, A.__scopeId = "data-v-02e63132";
      var Q = A, Z = e("bc3a"), U = e.n(Z), _e = 15e3, ve = function(x) {
        U.a.defaults.baseURL = x, U.a.defaults.timeout = _e, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Le(x, R, P, N, K, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var R = T(), P = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: R == null ? void 0 : R.color, iconName: P };
      } });
      e("38cd"), Be.render = Le;
      var Re = Be, Ae = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ne = { class: "hand-write-board" }, We = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Ze = Ae(function(x, R, P, N, K, ue) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ne, [Object(t.createVNode)(pe, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", We, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ye) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: ye.type, type: ye.type, data: ye.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function $(x, R, P, N, K, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: R[1] || (R[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: R[2] || (R[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: R[3] || (R[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: R[4] || (R[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: R[5] || (R[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: R[6] || (R[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: R[7] || (R[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function ee(x, R, P, N, K, ue, pe) {
        try {
          var de = x[ue](pe), ye = de.value;
        } catch (Ue) {
          return void P(Ue);
        }
        de.done ? R(ye) : Promise.resolve(ye).then(N, K);
      }
      function D(x) {
        return function() {
          var R = this, P = arguments;
          return new Promise(function(N, K) {
            var ue = x.apply(R, P);
            function pe(ye) {
              ee(ue, N, K, pe, de, "next", ye);
            }
            function de(ye) {
              ee(ue, N, K, pe, de, "throw", ye);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ne, re, ke = function() {
        var x = D(regeneratorRuntime.mark(function R(P, N, K, ue) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, U.a.post("", { lib: ue, lpXis: P, lpYis: N, lpCis: K });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, R);
        }));
        return function(R, P, N, K) {
          return x.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var R = T(), P = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), N = Object(t.ref)(null);
        function K() {
          return ue.apply(this, arguments);
        }
        function ue() {
          return ue = D(regeneratorRuntime.mark(function Pe() {
            var Qe, Me;
            return regeneratorRuntime.wrap(function(et) {
              for (; ; ) switch (et.prev = et.next) {
                case 0:
                  return et.next = 2, ke(P.clickX, P.clickY, P.clickC, x.lib);
                case 2:
                  Qe = et.sent, Me = Qe.data, g.emit("getWordsFromServer", (Me == null ? void 0 : Me.v) || "");
                case 5:
                case "end":
                  return et.stop();
              }
            }, Pe);
          })), ue.apply(this, arguments);
        }
        function pe() {
          N.value && ne && (P.clickX = [], P.clickY = [], P.clickC = [], ne.clearRect(0, 0, P.width, P.height));
        }
        function de(Pe) {
          if (Pe.type.includes("mouse")) {
            var Qe = Pe;
            return Math.floor(Qe.clientX - P.x);
          }
          if (Pe.type.includes("touch")) {
            var Me, et = Pe;
            return Math.floor(((Me = et.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientX) - P.x);
          }
          return 0;
        }
        function ye(Pe) {
          if (Pe.type.includes("mouse")) {
            var Qe = Pe;
            return Math.floor(Qe.clientY - P.y);
          }
          if (Pe.type.includes("touch")) {
            var Me, et = Pe;
            return Math.floor(((Me = et.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientY) - P.y);
          }
          return 0;
        }
        function Ue(Pe) {
          if (ne) {
            P.isMouseDown = !0;
            var Qe = de(Pe), Me = ye(Pe);
            clearTimeout(re), P.oldX = Qe, P.oldY = Me, ne.beginPath();
          }
        }
        function Fe(Pe) {
          if (ne && (Pe.preventDefault(), P.isMouseDown)) {
            var Qe = de(Pe), Me = ye(Pe);
            P.clickX.push(Qe), P.clickY.push(Me), P.clickC.push(0), ne.strokeStyle = R == null ? void 0 : R.color, ne.fillStyle = R == null ? void 0 : R.color, ne.lineWidth = 4, ne.lineCap = "round", ne.moveTo(P.oldX, P.oldY), ne.lineTo(Qe, Me), ne.stroke(), P.oldX = Qe, P.oldY = Me;
          }
        }
        function qe() {
          P.isMouseDown && (P.isMouseDown = !1, re = setTimeout(function() {
            pe();
          }, 1500), P.clickC.pop(), P.clickC.push(1), K());
        }
        function Ke() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Pe = document.querySelector(".paint-board").getBoundingClientRect();
              P.x = Pe.x, P.y = Pe.y, P.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), P.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function gt() {
          var Pe;
          ne = (Pe = N.value) === null || Pe === void 0 ? void 0 : Pe.getContext("2d"), pe(), Ke(), window.addEventListener("animationend", Ke), window.addEventListener("resize", Ke), window.addEventListener("scroll", Ke);
        }
        return Object(t.onMounted)(function() {
          gt(), g.on("updateBound", function() {
            Ke();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", Ke), window.removeEventListener("resize", Ke), window.removeEventListener("scroll", Ke), g.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(P)), {}, { move: Fe, down: Ue, mouseup: qe, canvasRef: N });
      } });
      he.render = $;
      var se = he;
      function Se(x, R, P, N, K, ue) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: R[2] || (R[2] = function(de) {
          return x.isHoverStatus = !0;
        }), onMouseleave: R[3] || (R[3] = function(de) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Oe = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Re }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, R) {
        var P = R.emit, N = T(), K = Object(t.ref)(!1), ue = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), pe = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || K.value ? { color: "#f5f5f5", background: N == null ? void 0 : N.color } : { color: N == null ? void 0 : N.color, background: "#f5f5f5" };
        });
        function de(ye) {
          ye.preventDefault(), P("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: K, getStyle: pe, getCode: ue, click: de };
      } });
      e("de23"), Oe.render = Se;
      var le = Oe, I = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: se, KeyCodeButton: le }, setup: function(x, R) {
        var P = R.emit, N = T(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ue(pe) {
          var de = pe.data, ye = pe.type;
          switch (ye) {
            case "close":
              N == null || N.closeKeyBoard();
              break;
            case "back":
              N == null || N.changeDefaultBoard(), g.emit("resultReset"), g.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              P("trigger", { data: de, type: ye });
              break;
          }
        }
        return f({ click: ue }, Object(t.toRefs)(K));
      } });
      e("9aaf"), I.render = Ze, I.__scopeId = "data-v-1b5e0983";
      var X = I, Ve = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var rt = { class: "default-key-board" }, dt = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ve(function(x, R, P, N, K, ue) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", rt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(de, ye) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ye + 1)], key: ye }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function(Ue) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: x.isUpper, key: Ue, type: Ue, data: Ue, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", dt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ae = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, me = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: le }, emits: ["translate", "trigger", "change"], setup: function(x, R) {
        var P = R.emit, N = T(), K = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ue() {
          var de;
          K.line4 = JSON.parse(JSON.stringify(q)), N != null && (de = N.modeList) !== null && de !== void 0 && de.find(function(ye) {
            return ye === "handwrite";
          }) && N !== null && N !== void 0 && N.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var ye = de.data, Ue = de.type;
          switch (Ue) {
            case "close":
              K.oldVal = "", N == null || N.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || g.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var Fe;
                g.emit("keyBoardChange", "number");
                var qe = JSON.parse(JSON.stringify(me.line3));
                N != null && (Fe = N.modeList) !== null && Fe !== void 0 && Fe.find(function(Ke) {
                  return Ke === "symbol";
                }) || (qe.shift(), qe.unshift("+")), K.lineList = [me.line1, me.line2, qe];
              } else g.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (g.emit("keyBoardChange", "symbol"), K.lineList = [ae.line1, ae.line2, ae.line3]) : (g.emit("keyBoardChange", "number"), K.lineList = [me.line1, me.line2, me.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Ue === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), P("translate", K.oldVal)) : (Ue === "handwrite" && g.emit("keyBoardChange", "handwrite"), P("trigger", { data: ye, type: Ue }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? P("change", ye) : (P("translate", K.oldVal + ye), K.oldVal = K.oldVal + ye);
              break;
          }
        }
        return ue(), Object(t.onMounted)(function() {
          g.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: pe });
      } });
      e("f8b0"), oe.render = z, oe.__scopeId = "data-v-4b78e5a1";
      var ce = oe, ge = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, De = e("ec57"), ze = function(x) {
        return x.keys().map(x);
      };
      ze(De);
      var it = [], Ee = null, at = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: j }, components: { Result: Q, SvgIcon: Re, HandBoard: X, DefaultBoard: ce }, setup: function(x, R) {
        var P = R.emit, N = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function ue(Ce) {
          var Te, Ie;
          switch (Object(t.nextTick)(function() {
            g.emit("keyBoardChange", "CN");
          }), Ce) {
            case "en":
              N.showMode = "default", Object(t.nextTick)(function() {
                var $e;
                ($e = K.value) === null || $e === void 0 || $e.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              N.showMode = "default", Object(t.nextTick)(function() {
                var $e;
                ($e = K.value) === null || $e === void 0 || $e.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Te = x.modeList) !== null && Te !== void 0 && Te.find(function($e) {
                return $e === "handwrite";
              }) && x.handApi ? (N.showMode = "handwrite", Object(t.nextTick)(function() {
                g.emit("keyBoardChange", "handwrite");
              })) : N.showMode = "default";
              break;
            case "symbol":
              N.showMode = "default", (Ie = x.modeList) !== null && Ie !== void 0 && Ie.find(function($e) {
                return $e === "symbol";
              }) && Object(t.nextTick)(function() {
                var $e, st;
                ($e = K.value) === null || $e === void 0 || $e.click({ data: ".?123", type: "change2num" }), (st = K.value) === null || st === void 0 || st.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              N.showMode = "default";
              break;
          }
        }
        function pe(Ce) {
          if (N.visible = !0, Ee = Ce.target, ue(Ee.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Te = document.querySelector(".key-board-modal");
            Te.style.display = "block";
          }
        }
        function de() {
          if (Ee && Ee.blur(), Ee = null, N.visible = !1, P("closed"), N.showMode = "default", N.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Ce = document.querySelector(".key-board-modal");
            Ce.style.display = "none";
          }
        }
        function ye() {
          x.closeOnClickModal && de(), P("modalClick");
        }
        function Ue() {
          var Ce;
          if (document.querySelector(".key-board-modal")) {
            var Te;
            (Te = document.querySelector(".key-board-modal")) === null || Te === void 0 || Te.addEventListener("click", ye);
          } else {
            var Ie = document.createElement("div");
            Ie.className = "key-board-modal", Ie.style.display = "none", (Ce = document.querySelector("body")) === null || Ce === void 0 || Ce.appendChild(Ie), Ie.addEventListener("click", ye);
          }
        }
        function Fe() {
          x.handApi && ve(x.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(Ce) {
            Ce.getAttribute("data-mode") !== null && (it.push(Ce), Ce.addEventListener("focus", pe), x.blurHide && Ce.addEventListener("blur", de));
          });
        }
        function qe(Ce) {
          if (!Ee) return "";
          var Te = Ee, Ie = Te.selectionStart, $e = Te.selectionEnd;
          if (!Ie || !$e) return "";
          var st = Ce.substring(0, Ie - 1) + Ce.substring($e);
          return Te.value = st, Te.focus(), Te.selectionStart = Ie - 1, Te.selectionEnd = Ie - 1, st;
        }
        function Ke(Ce) {
          var Te = Ce.type;
          switch (Te) {
            case "handwrite":
              N.showMode = "handwrite";
              break;
            case "delete":
              if (!Ee) return;
              var Ie = qe(Ee.value);
              Ee.value = Ie, P("change", Ie, Ee.getAttribute("data-prop") || Ee);
              break;
          }
        }
        function gt(Ce, Te) {
          if (!Ee) return "";
          var Ie = Ee, $e = Ie.selectionStart || 0, st = Ie.selectionEnd || 0, Et = Ce.substring(0, $e) + Te + Ce.substring(st);
          return Ie.value = Et, Ie.focus(), Ie.selectionStart = $e + Te.length, Ie.selectionEnd = $e + Te.length, Et;
        }
        function Pe(Ce) {
          if (Ee) {
            var Te = gt(Ee.value, Ce);
            Ee.value = Te, P("change", Te, Ee.getAttribute("data-prop") || Ee), P("keyChange", Ce, Ee.getAttribute("data-prop") || Ee);
          }
        }
        function Qe(Ce) {
          var Te = new RegExp("^".concat(Ce, "\\w*")), Ie = Object.keys(ge).filter(function($e) {
            return Te.test($e);
          }).sort();
          N.resultVal = { code: Ce, value: Ce ? Ie.length > 1 ? Ie.reduce(function($e, st) {
            return $e + ge[st];
          }, "") : ge[Ie[0]] : "" }, Ee && P("keyChange", Ce, Ee.getAttribute("data-prop") || Ee);
        }
        function Me() {
          Fe();
        }
        function et() {
          return Ee;
        }
        return Object(t.onMounted)(function() {
          x.modal && Ue(), Fe(), g.on("resultReset", function() {
            N.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Ce;
          (Ce = document.querySelector(".key-board-modal")) === null || Ce === void 0 || Ce.removeEventListener("click", ye), it.forEach(function(Te) {
            Te.removeEventListener("focus", pe), Te.removeEventListener("blur", de);
          });
        }), F(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          N.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(N)), {}, { defaultBoardRef: K, getCurrentInput: et, translate: Qe, reSignUp: Me, trigger: Ke, change: Pe });
      } });
      at.render = a;
      var He = at;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var wt = He, It = wt;
      d.default = It;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), s = e("50c4"), u = e("fc6a"), a = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), v = l("species"), p = [].slice, h = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(m, y) {
        var b, O, C, w = u(this), _ = s(w.length), g = t(m, _), S = t(y === void 0 ? _ : y, _);
        if (r(w) && (b = w.constructor, typeof b != "function" || b !== Array && !r(b.prototype) ? o(b) && (b = b[v], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return p.call(w, g, S);
        for (O = new (b === void 0 ? Array : b)(h(S - g, 0)), C = 0; g < S; g++, C++) g in w && a(O, C, w[g]);
        return O.length = C, O;
      } });
    }, fc6a: function(i, d, e) {
      var n = e("44ad"), o = e("1d80");
      i.exports = function(r) {
        return n(o(r));
      };
    }, fdbc: function(i, d) {
      i.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(i, d, e) {
      var n = e("4930");
      i.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(i, d, e) {
      var n = e("da84");
      i.exports = n.Promise;
    } });
  });
})(Nt);
var zo = Nt.exports;
const Pt = /* @__PURE__ */ qo(zo);
Rt({
  components: { KeyBoard: Pt },
  setup() {
    function xe(te, G) {
      console.log("change value ---->", te), console.log("change input dom ---->", G);
    }
    return {
      change: xe
    };
  }
});
const Ko = { class: "wifi-component" }, Qo = { class: "row" }, Ho = { class: "column" }, Yo = { class: "column" }, Go = { class: "status" }, Xo = { class: "row" }, Jo = { class: "column" }, Zo = {
  key: 0,
  class: "wifi-modal"
}, er = { class: "wifi-modal-content" }, tr = { class: "wifi-list" }, nr = {
  key: 0,
  class: "no-wifi"
}, or = ["onClick"], rr = { class: "wifi-ssid" }, ir = { class: "signal-strength" }, ar = {
  __name: "WiFi",
  setup(xe) {
    const { sendToPyQt: te } = Je(), G = Y("未连接"), i = Y("无网络"), d = Y("未知"), e = Y(""), n = Y(""), o = Y(!1), r = Y([]), t = Y(null), s = () => {
      te("check_wifi_status", {});
    }, u = () => {
      t.value = setInterval(s, 5e3);
    }, a = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ht(() => {
      u();
      const { message: m } = Je();
      lt(m, (y) => {
        if (y && y.type === "wifi_list") {
          const b = JSON.parse(y.content);
          r.value = b;
        } else if (y && y.type === "wifi_status") {
          const b = JSON.parse(y.content);
          G.value = b.wifi_name, i.value = b.internet_status, d.value = b.zerotier_ip;
        }
      });
    }), St(() => {
      a();
    });
    const l = async () => {
      o.value = !0, r.value = [], document.body.style.overflow = "hidden", c();
    }, c = () => {
      r.value = [], te("search_wifi", {});
    }, f = () => {
      o.value = !1, document.body.style.overflow = "auto";
    }, v = (m) => {
      e.value = m.ssid, f();
    }, p = () => {
      te("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, h = (m, y) => {
      y.placeholder === "WiFi 名称" ? e.value = m : y.placeholder === "WiFi 密码" && (n.value = m);
    };
    return (m, y) => (be(), we("div", Ko, [
      k("div", Qo, [
        k("div", Ho, [
          pt(k("input", {
            "onUpdate:modelValue": y[0] || (y[0] = (b) => e.value = b),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [mt, e.value]
          ])
        ]),
        k("div", Yo, [
          k("div", Go, [
            ft(" WiFi: " + je(G.value) + " | 网络: " + je(i.value) + " ", 1),
            y[2] || (y[2] = k("br", null, null, -1)),
            ft(" zerotier ip地址: " + je(d.value), 1)
          ])
        ])
      ]),
      k("div", Xo, [
        k("div", Jo, [
          pt(k("input", {
            "onUpdate:modelValue": y[1] || (y[1] = (b) => n.value = b),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [mt, n.value]
          ])
        ]),
        k("div", { class: "column" }, [
          k("div", { class: "button-group" }, [
            k("button", { onClick: l }, "搜索可用 WiFi"),
            k("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      Ye(Ut(Pt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: h,
        class: "scaled-keyboard"
      }),
      o.value ? (be(), we("div", Zo, [
        k("div", er, [
          y[4] || (y[4] = k("h2", null, "可用的WiFi网络", -1)),
          k("div", tr, [
            r.value.length === 0 ? (be(), we("div", nr, y[3] || (y[3] = [
              k("div", { class: "loading-spinner" }, null, -1),
              k("div", null, "搜索中...", -1)
            ]))) : (be(!0), we(nt, { key: 1 }, ot(r.value, (b) => (be(), we("div", {
              key: b.ssid,
              class: "wifi-item",
              onClick: (O) => v(b)
            }, [
              k("span", rr, je(b.ssid), 1),
              k("span", ir, "信号强度: " + je(b.signal), 1)
            ], 8, or))), 128))
          ]),
          k("div", { class: "modal-buttons" }, [
            k("button", { onClick: c }, "重新搜索"),
            k("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : ct("", !0)
    ]));
  }
}, sr = /* @__PURE__ */ vt(ar, [["__scopeId", "data-v-e6b1dc64"]]), ur = {
  key: 0,
  class: "numeric-keyboard"
}, cr = { class: "keyboard" }, lr = { class: "current-value" }, dr = ["onClick"], fr = {
  __name: "StrNumericKeyboard",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    showKeyboard: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "update:showKeyboard"],
  setup(xe, { emit: te }) {
    const G = xe, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = Y("");
    lt(() => G.showKeyboard, (o) => {
      o && (e.value = G.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => xe.showKeyboard ? (be(), we("div", ur, [
      k("div", cr, [
        k("div", lr, je(e.value), 1),
        (be(!0), we(nt, null, ot(d.value, (t) => (be(), we("div", {
          key: t.join(),
          class: "row"
        }, [
          (be(!0), we(nt, null, ot(t, (s) => (be(), we("button", {
            key: s,
            onClick: (u) => n(s),
            class: tt({ "function-key": s === "清除" || s === "确定" })
          }, je(s), 11, dr))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, Ct = /* @__PURE__ */ vt(fr, [["__scopeId", "data-v-2ccc1cb7"]]), pr = { class: "container" }, vr = { class: "column" }, hr = { class: "status-bar" }, mr = ["disabled"], gr = { class: "column" }, yr = {
  key: 0,
  class: "modal"
}, br = { class: "modal-content" }, wr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(xe, { emit: te }) {
    const { sendToPyQt: G } = Je(), i = bt({
      isPyQtWebEngine: !1
    }), d = Y("未激活"), e = Y(0), n = Y(""), o = Y(""), r = Y(!1), t = Y(7776e3);
    let s, u;
    const a = Y(0), l = Y(1), c = Y(null), f = Y(!1), v = Y(!1), p = yt(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${h.value}`), h = yt(() => {
      const H = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), F = Math.floor(e.value % (60 * 60) / 60), T = e.value % 60;
      return `${H}天 ${W.toString().padStart(2, "0")}:${F.toString().padStart(2, "0")}:${T.toString().padStart(2, "0")}`;
    }), m = yt(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function y(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), a.value = 0, u = setInterval(() => {
        a.value += 2, a.value >= 100 && (clearInterval(u), C());
      }, 30));
    }
    function b(H) {
      H.target.releasePointerCapture(H.pointerId), O();
    }
    function O() {
      clearInterval(u), a.value = 0;
    }
    function C() {
      G("activate_device", {});
    }
    function w(H, W) {
      G("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: W } }), d.value = "已激活", n.value = H, c.value = W, _();
    }
    function _() {
      g(), s = setInterval(() => {
        e.value > 0 ? g() : S();
      }, 1e3);
    }
    function g() {
      const H = Date.now(), W = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - H) / 1e3));
    }
    function S() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(s), ie();
    }
    function j() {
      L(o.value);
    }
    function L(H) {
      G("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function E() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(s);
    }
    function M() {
      r.value = !1, document.body.style.overflow = "auto", l.value++, s && clearInterval(s), _();
    }
    St(() => {
      clearInterval(s), clearInterval(u);
    }), ht(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Je();
        lt(H, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const F = JSON.parse(W.content);
              F.target === "attemptUnlock" && (F.result === "success" ? (r.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, G("update_baseTime", c.value), M(), G("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : F.result === "forever_success" ? (E(), G("Lock_set_response", { method: "permanentUnlock", args: {} })) : G("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (F) {
              console.error("Failed to parse confirm lock password :", F);
            }
          else if (W && W.type === "device_activated")
            try {
              const F = JSON.parse(W.content);
              w(F.device_random_code, F.device_base_time);
            } catch (F) {
              console.error("Failed to parse device activation result:", F);
            }
          else if (W && W.type === "device_info")
            try {
              const F = JSON.parse(W.content);
              d.value = F.device_status, n.value = F.device_random_code, l.value = F.device_lock_count, c.value = F.device_base_time, F.device_status === "已激活" ? _() : F.device_status === "永久激活" && E();
            } catch (F) {
              console.error("Failed to parse device status:", F);
            }
          else if (W && W.type === "Lock_init")
            V();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const F = JSON.parse(W.content);
            F.method === "requestActivation" ? C() : F.method === "attemptUnlock" && L(F.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const V = () => {
      const H = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: o.value,
        isLocked: r.value,
        lockInterval: t.value,
        lockCount: l.value,
        baseTime: c.value,
        progressWidth: a.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: v.value
      };
      console.log("Sending Lock initial state:", H), G("Lock_init_response", H);
    }, J = te, ie = () => {
      J("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, W) => (be(), we("div", pr, [
      k("div", vr, [
        k("div", hr, je(p.value), 1),
        k("button", {
          class: "activation-button",
          onPointerdown: y,
          onPointerup: b,
          onPointercancel: O,
          onPointerleave: O,
          disabled: d.value !== "未激活"
        }, [
          ft(je(m.value) + " ", 1),
          k("div", {
            class: "progress-bar",
            style: Dt({ width: a.value + "%" })
          }, null, 4)
        ], 40, mr)
      ]),
      k("div", gr, [
        pt(k("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (F) => o.value = F),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (F) => f.value = !0)
        }, null, 544), [
          [mt, o.value]
        ]),
        k("button", {
          class: "unlock-button",
          onClick: j
        }, "解锁")
      ]),
      r.value ? (be(), we("div", yr, [
        k("div", br, [
          W[8] || (W[8] = k("h3", null, "设备已锁定", -1)),
          k("h3", null, "第 " + je(l.value) + " 次锁定", 1),
          k("h3", null, "设备随机码: " + je(n.value), 1),
          pt(k("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (F) => o.value = F),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (F) => v.value = !0)
          }, null, 544), [
            [mt, o.value]
          ]),
          k("button", {
            class: "unlock-button",
            onClick: j
          }, "解锁")
        ])
      ])) : ct("", !0),
      Ye(Ct, {
        modelValue: o.value,
        "onUpdate:modelValue": W[4] || (W[4] = (F) => o.value = F),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (F) => f.value = F)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Ye(Ct, {
        modelValue: o.value,
        "onUpdate:modelValue": W[6] || (W[6] = (F) => o.value = F),
        showKeyboard: v.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (F) => v.value = F)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, xr = /* @__PURE__ */ vt(wr, [["__scopeId", "data-v-3d3fd364"]]), kr = { class: "app-container" }, Sr = {
  __name: "App",
  setup(xe) {
    Mt();
    const te = Y(""), G = (i) => {
      te.value = i;
    };
    return (i, d) => (be(), we("div", kr, [
      d[0] || (d[0] = k("h1", null, "涪特智能养护台车控制系统", -1)),
      Ye(Un),
      Ye(Vo),
      Ye(ln),
      Ye(To, { message: te.value }, null, 8, ["message"]),
      Ye(sr),
      Ye(xr, { onMessageFromA: G })
    ]));
  }
};
export {
  Sr as default
};
