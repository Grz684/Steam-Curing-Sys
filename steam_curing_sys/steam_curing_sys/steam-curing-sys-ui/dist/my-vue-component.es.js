import Bt, { ref as Y, onMounted as ht, provide as xt, readonly as kt, inject as _t, watch as lt, openBlock as we, createElementBlock as xe, createElementVNode as _, toDisplayString as Ce, Fragment as rt, renderList as it, normalizeClass as ot, createCommentVNode as ct, reactive as bt, createVNode as Ze, withDirectives as pt, vModelRadio as jt, createTextVNode as ft, vModelText as mt, onUnmounted as St, computed as yt, vModelCheckbox as It, defineComponent as Rt, unref as Ut, normalizeStyle as Dt } from "vue";
const Tt = Symbol(), Lt = Symbol(), At = Symbol();
function Ft(ke, te) {
  ke && ke.messageSignal ? ke.messageSignal.connect((X) => {
    try {
      const i = JSON.parse(X);
      te.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), te.value = { type: "unknown", content: X };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Mt() {
  const ke = Y(null), te = Y(null), X = Y("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      ke.value = d, te.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), Ft(te.value, X), te.value && typeof te.value.vueReady == "function" ? te.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ht(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), xt(Tt, kt(ke)), xt(Lt, kt(te)), xt(At, kt(X));
}
function tt() {
  const ke = _t(Tt), te = _t(Lt), X = _t(At);
  return (!ke || !te || !X) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: ke,
    bridge: te,
    message: X,
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
const vt = (ke, te) => {
  const X = ke.__vccOpts || ke;
  for (const [i, d] of te)
    X[i] = d;
  return X;
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
  setup(ke, { emit: te }) {
    const X = ke, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = Y("");
    lt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => ke.showKeyboard ? (we(), xe("div", Vt, [
      _("div", Wt, [
        _("div", qt, Ce(e.value), 1),
        (we(!0), xe(rt, null, it(d.value, (t) => (we(), xe("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), xe(rt, null, it(t, (a) => (we(), xe("button", {
            key: a,
            onClick: (u) => n(a),
            class: ot({ "function-key": a === "清除" || a === "确定" })
          }, Ce(a), 11, zt))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, Ot = /* @__PURE__ */ vt(Kt, [["__scopeId", "data-v-541feda2"]]), Qt = { class: "settings-container" }, Ht = { class: "setting-group" }, Yt = { class: "setting-item" }, Xt = { class: "setting-controls" }, Gt = ["value"], Jt = { class: "setting-item" }, Zt = { class: "setting-controls" }, en = ["value"], tn = { class: "setting-group" }, nn = { class: "setting-item" }, on = { class: "setting-controls" }, rn = ["value"], an = { class: "setting-item" }, sn = { class: "setting-controls" }, un = ["value"], cn = {
  __name: "SensorSettings",
  setup(ke) {
    const { sendToPyQt: te } = tt(), X = bt({
      isPyQtWebEngine: !1
    }), i = Y(35), d = Y(25), e = Y(95), n = Y(90), o = Y(!1), r = Y(null), t = Y("");
    ht(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: v } = tt();
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
    const a = (v, p) => {
      const h = v === "tempUpper" ? i : v === "tempLower" ? d : v === "humidityUpper" ? e : n;
      h.value = (h.value || 0) + p, v.startsWith("temp") ? u(v === "tempUpper" ? "upper" : "lower") : s(v === "humidityUpper" ? "upper" : "lower");
    }, u = (v) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), v === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), l();
    }, s = (v) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), v === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const v = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", v), X.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), te("updateLimitSettings", v)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (v) => {
      r.value = v, o.value = !0, t.value = v.startsWith("temp") ? v === "tempUpper" ? i.value : d.value : v === "humidityUpper" ? e.value : n.value;
    }, f = (v) => {
      const p = parseFloat(v);
      isNaN(p) || (r.value === "tempUpper" ? (i.value = p, u("upper")) : r.value === "tempLower" ? (d.value = p, u("lower")) : r.value === "humidityUpper" ? (e.value = p, s("upper")) : r.value === "humidityLower" && (n.value = p, s("lower"))), r.value = null;
    };
    return (v, p) => (we(), xe("div", Qt, [
      _("div", Ht, [
        p[15] || (p[15] = _("h2", null, "温度设置 (°C)", -1)),
        _("div", Yt, [
          p[13] || (p[13] = _("span", { class: "setting-label" }, "上限：", -1)),
          _("div", Xt, [
            _("button", {
              onClick: p[0] || (p[0] = (h) => a("tempUpper", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (h) => c("tempUpper")),
              readonly: ""
            }, null, 40, Gt),
            _("button", {
              onClick: p[2] || (p[2] = (h) => a("tempUpper", 1))
            }, "+")
          ])
        ]),
        _("div", Jt, [
          p[14] || (p[14] = _("span", { class: "setting-label" }, "下限：", -1)),
          _("div", Zt, [
            _("button", {
              onClick: p[3] || (p[3] = (h) => a("tempLower", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (h) => c("tempLower")),
              readonly: ""
            }, null, 40, en),
            _("button", {
              onClick: p[5] || (p[5] = (h) => a("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      _("div", tn, [
        p[18] || (p[18] = _("h2", null, "湿度设置 (%)", -1)),
        _("div", nn, [
          p[16] || (p[16] = _("span", { class: "setting-label" }, "上限：", -1)),
          _("div", on, [
            _("button", {
              onClick: p[6] || (p[6] = (h) => a("humidityUpper", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (h) => c("humidityUpper")),
              readonly: ""
            }, null, 40, rn),
            _("button", {
              onClick: p[8] || (p[8] = (h) => a("humidityUpper", 1))
            }, "+")
          ])
        ]),
        _("div", an, [
          p[17] || (p[17] = _("span", { class: "setting-label" }, "下限：", -1)),
          _("div", sn, [
            _("button", {
              onClick: p[9] || (p[9] = (h) => a("humidityLower", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (h) => c("humidityLower")),
              readonly: ""
            }, null, 40, un),
            _("button", {
              onClick: p[11] || (p[11] = (h) => a("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Ze(Ot, {
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
  setup(ke, { emit: te }) {
    const X = ke, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = Y("");
    lt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : o === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : o === "." && e.value.includes(".") || (e.value += o);
    };
    return (o, r) => ke.showKeyboard ? (we(), xe("div", dn, [
      _("div", fn, [
        _("div", pn, Ce(e.value), 1),
        (we(!0), xe(rt, null, it(d.value, (t) => (we(), xe("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), xe(rt, null, it(t, (a) => (we(), xe("button", {
            key: a,
            onClick: (u) => n(a),
            class: ot({
              "function-key": ["清除", "确定"].includes(a),
              "operator-key": a === "-"
            })
          }, Ce(a), 11, vn))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, mn = /* @__PURE__ */ vt(hn, [["__scopeId", "data-v-3e928534"]]), gn = { class: "sensor-data-group" }, yn = { class: "sensor-section" }, bn = { class: "sensor-container" }, wn = { class: "sensor-grid" }, xn = ["onClick"], kn = { class: "sensor-title" }, _n = { class: "sensor-value" }, Sn = { class: "sensor-section" }, On = { class: "sensor-container" }, En = { class: "sensor-grid" }, jn = ["onClick"], Cn = { class: "sensor-title" }, Tn = { class: "sensor-value" }, Ln = {
  key: 0,
  class: "dialog-overlay"
}, An = { class: "dialog" }, Nn = { class: "dialog-content" }, Pn = { class: "radio-group" }, $n = { class: "input-group" }, Bn = ["placeholder"], In = { class: "dialog-actions" }, Rn = {
  __name: "SensorDisplay",
  setup(ke) {
    const te = Y({ temperature: {}, humidity: {} }), X = Y({
      temperature: {},
      humidity: {}
    }), i = Y(null), d = Y(!1), e = Y("offset"), n = Y(""), o = Y(!1), { sendToPyQt: r } = tt();
    ht(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: c } = tt();
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
              X.value.temperature = v.temperature, X.value.humidity = v.humidity;
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
    }, a = Y(!1), u = Y(""), s = (c, f) => {
      i.value = f, n.value = c;
      const v = X.value[c][f];
      v ? (e.value = v.type, u.value = String(v.value)) : (e.value = "offset", u.value = ""), d.value = !0, a.value = !1;
    }, l = async () => {
      try {
        const c = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(u.value) || 0
        };
        X.value[n.value] || (X.value[n.value] = {}), X.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(u.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", c), d.value = !1, u.value = "", a.value = !1;
      } catch (c) {
        console.error("Error applying adjustment:", c);
      }
    };
    return (c, f) => (we(), xe("div", gn, [
      _("div", yn, [
        f[7] || (f[7] = _("h2", null, "温度传感器【传感器1、4、7位于左拱腰，2、5、8位于拱顶，3、6、9位于右拱腰】", -1)),
        _("div", bn, [
          _("div", wn, [
            (we(!0), xe(rt, null, it(te.value.temperature, (v, p) => (we(), xe("div", {
              key: p,
              class: "sensor-card",
              onClick: (h) => o.value ? s("temperature", p) : null
            }, [
              _("div", kn, Ce(p), 1),
              _("div", _n, Ce(v), 1)
            ], 8, xn))), 128))
          ])
        ])
      ]),
      _("div", Sn, [
        f[8] || (f[8] = _("h2", null, "湿度传感器", -1)),
        _("div", On, [
          _("div", En, [
            (we(!0), xe(rt, null, it(te.value.humidity, (v, p) => (we(), xe("div", {
              key: p,
              class: "sensor-card",
              onClick: (h) => o.value ? s("humidity", p) : null
            }, [
              _("div", Cn, Ce(p), 1),
              _("div", Tn, Ce(v), 1)
            ], 8, jn))), 128))
          ])
        ])
      ]),
      d.value ? (we(), xe("div", Ln, [
        _("div", An, [
          _("h3", null, "调整传感器: " + Ce(i.value), 1),
          _("div", Nn, [
            _("div", Pn, [
              _("label", null, [
                pt(_("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (v) => e.value = v),
                  value: "offset"
                }, null, 512), [
                  [jt, e.value]
                ]),
                f[9] || (f[9] = ft(" 调整偏移值 "))
              ]),
              _("label", null, [
                pt(_("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (v) => e.value = v),
                  value: "value"
                }, null, 512), [
                  [jt, e.value]
                ]),
                f[10] || (f[10] = ft(" 直接设置值 "))
              ])
            ]),
            _("div", $n, [
              pt(_("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (v) => u.value = v),
                readonly: "",
                onClick: f[3] || (f[3] = (v) => a.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Bn), [
                [mt, u.value]
              ])
            ])
          ]),
          _("div", In, [
            _("button", {
              onClick: f[4] || (f[4] = (v) => d.value = !1)
            }, "取消"),
            _("button", {
              onClick: l,
              class: "primary"
            }, "确定")
          ])
        ]),
        Ze(mn, {
          modelValue: u.value,
          "onUpdate:modelValue": f[5] || (f[5] = (v) => u.value = v),
          showKeyboard: a.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (v) => a.value = v)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : ct("", !0)
    ]));
  }
}, Un = /* @__PURE__ */ vt(Rn, [["__scopeId", "data-v-41635404"]]), Dn = { class: "integrated-control-system" }, Fn = { class: "mode-controls" }, Mn = { class: "btn-group" }, Vn = { class: "btn-group" }, Wn = ["disabled"], qn = ["disabled"], zn = { class: "systems-container" }, Kn = { class: "side-controls" }, Qn = { class: "left-box" }, Hn = { class: "steam_engine" }, Yn = ["disabled"], Xn = { class: "text_status" }, Gn = { class: "right-box" }, Jn = { class: "controls" }, Zn = { class: "input-group" }, eo = ["value"], to = { class: "input-group" }, no = ["value"], oo = { class: "middle-box" }, ro = { class: "state-machine-container" }, io = { class: "state-machine" }, ao = { viewBox: "0 0 800 400" }, so = ["d"], uo = ["x1", "y1", "x2", "y2"], co = ["x", "y"], lo = ["x", "y"], fo = ["x", "y"], po = ["cx", "cy"], vo = ["x", "y"], ho = ["x", "y"], mo = { class: "control-systems" }, go = { class: "control-row" }, yo = { class: "control-item" }, bo = { class: "steam_engine" }, wo = ["disabled"], xo = { class: "control-item" }, ko = { class: "steam_engine" }, _o = ["disabled"], So = { class: "control-item" }, Oo = { class: "steam_engine" }, Eo = ["disabled"], jo = { class: "text_status" }, Fe = 400, Me = 200, Oe = 120, Co = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(ke) {
    const te = Y(!1), X = Y(!1), i = Y(!1), d = Y(!1), e = Y(10), n = Y(0), o = Y(10), r = Y(e.value), t = Y(n.value), a = Y(o.value), u = Y(e.value), s = Y(n.value), l = Y(o.value), c = Y(""), f = Y(0), v = Y(!0), p = Y(!1), h = Y(!1), m = Y(null), g = Y(""), b = Y(!1), { sendToPyQt: S } = tt(), C = Y(0), x = bt({
      isPyQtWebEngine: !1
    }), w = Y([]);
    let y, j, E;
    const L = ke;
    lt(() => L.message, (re) => {
      re != null && re.content && (v.value ? R("manual") : R("auto"));
    });
    const O = Y("S0"), F = Y([
      { x: Fe, y: Me - Oe, label: "S1", text1: "打开全部", text2: "四个蒸汽机" },
      { x: Fe + Oe, y: Me, label: "S2", text1: "关闭一半蒸汽机", text2: "只打开两个蒸汽机" },
      { x: Fe, y: Me + Oe, label: "S3", text1: "关闭全部蒸汽机", text2: "根据湿度开/关造雾机" },
      { x: Fe - Oe, y: Me, label: "S4", text1: "打开两个蒸汽机", text2: "自动关闭造雾机" }
    ]), V = Y([
      {
        path: `M ${Fe + 80} ${Me - Oe} Q ${Fe + Oe} ${Me - Oe} ${Fe + Oe} ${Me - 40}`,
        lineStart: { x: Fe + Oe - 40, y: Me - Oe + 40 },
        conditionX: Fe + Oe + 100,
        conditionY: Me - Oe + 40,
        condition: "C1",
        text1: "拱顶平均温度",
        text2: "高于温度上限"
      },
      {
        path: `M ${Fe + Oe} ${Me + 40} Q ${Fe + Oe} ${Me + Oe} ${Fe + 80} ${Me + Oe}`,
        lineStart: { x: Fe + Oe - 40, y: Me + Oe - 40 },
        conditionX: Fe + Oe + 100,
        conditionY: Me + Oe - 40,
        condition: "C2",
        text1: "拱腰平均温度",
        text2: "高于温度上限"
      },
      {
        path: `M ${Fe - 80} ${Me + Oe} Q ${Fe - Oe} ${Me + Oe} ${Fe - Oe} ${Me + 40}`,
        lineStart: { x: Fe - Oe + 40, y: Me + Oe - 40 },
        conditionX: Fe - Oe - 100,
        conditionY: Me + Oe - 40,
        condition: "C3",
        text1: "拱腰平均温度",
        text2: "低于温度下限"
      },
      {
        path: `M ${Fe - Oe} ${Me - 40} Q ${Fe - Oe} ${Me - Oe} ${Fe - 80} ${Me - Oe}`,
        lineStart: { x: Fe - Oe + 40, y: Me - Oe + 40 },
        conditionX: Fe - Oe - 100,
        conditionY: Me - Oe + 40,
        condition: "C4",
        text1: "拱顶平均温度",
        text2: "低于温度上限"
      }
    ]), J = (re) => {
      re === 0 ? O.value = "S0" : re === 1 ? O.value = "S1" : re === 2 ? O.value = "S2" : re === 3 ? O.value = "S3" : re === 4 && (O.value = "S4");
    };
    ht(() => {
      if (x.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, x.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: re } = tt();
        lt(re, (M) => {
          if (M && M.type === "update_spray_engine_status")
            te.value = M.content;
          else if (M && M.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (M && M.type === "update_left_steam_status")
            X.value = M.content;
          else if (M && M.type === "update_right_steam_status")
            i.value = M.content;
          else if (M && M.type === "update_sprinkler_settings")
            try {
              const G = JSON.parse(M.content);
              u.value = G.sprinkler_single_run_time, s.value = G.sprinkler_run_interval_time, l.value = G.sprinkler_loop_interval, t.value = s.value, r.value = u.value, a.value = l.value, console.log("Sprinkler Settings updated:", G);
            } catch (G) {
              console.error("Failed to parse sprinkler settings data:", G);
            }
          else if (M && M.type === "update_state_machine")
            console.log("Received state machine update:", M.content), J(M.content);
          else if (M && M.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", M.content);
            const G = JSON.parse(M.content);
            G.top_temperature !== -1 && G.side_temperature !== -1 && G.humidity !== -1 ? (T.value = String(G.top_temperature), A.value = String(G.side_temperature), z.value = String(G.humidity), b.value = !1) : (b.value = !0, G.top_temperature === -1 ? T.value = "未知" : T.value = String(G.top_temperature), G.side_temperature === -1 ? A.value = "未知" : A.value = String(G.side_temperature), G.humidity === -1 ? z.value = "未知" : z.value = String(G.humidity));
          } else if (M && M.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", M.content);
            const Ke = JSON.parse(M.content).args;
            u.value = Ke.sprinkler_single_run_time, s.value = Ke.sprinkler_run_interval_time, l.value = Ke.sprinkler_loop_interval, t.value = s.value, r.value = u.value, a.value = l.value, ee();
          } else if (M && M.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", M.content);
            const G = JSON.parse(M.content);
            G.method === "startSystem" ? ie() : G.method === "stopSystem" ? be() : G.method === "setMode" ? R(G.args.mode) : G.method === "click_toggleEngine" ? Ue() : G.method === "click_toggleSteamEngine" ? Ae() : G.method === "toggleManualSprinkler" && toggleManualSprinkler(G.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), St(() => {
      clearInterval(E), clearInterval(j), H();
    });
    const ae = (re) => {
      re !== void 0 && clearTimeout(re);
    }, H = () => {
      w.value.forEach((re) => {
        ae(re);
      }), w.value = [];
    }, W = () => {
      const re = {
        leftEngineOn: te.value,
        rightEngineOn: X.value,
        currentSingleRunTime: e.value,
        currentRunIntervalTime: n.value,
        currentLoopInterval: o.value,
        nextSingleRunTime: r.value,
        nextRunIntervalTime: t.value,
        nextLoopInterval: a.value,
        tempSingleRunTime: u.value,
        tempRunIntervalTime: s.value,
        tempLoopInterval: l.value,
        currentPhase: c.value,
        remainingTime: f.value,
        isAutoMode: v.value,
        isRunning: p.value,
        phaseStartTime: C.value
      };
      S("IntegratedControlSystem_init_response", re);
    }, U = yt(() => v.value ? p.value ? c.value === "run" ? `喷淋系统正在运行，剩余 ${f.value + 1} 秒` : c.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : c.value === "loop" ? `循环养护系统工作中，离下次喷淋剩余 ${f.value + 1} 秒` : "" : "喷淋系统未运行" : "手动模式"), T = Y("未知"), A = Y("未知"), z = Y("未知"), ne = yt(() => v.value ? p.value ? c.value === "loop" && b.value === !1 ? `拱顶平均温度: ${T.value}°C, 拱腰平均温度: ${A.value}°C, 平均湿度: ${z.value}%` : c.value === "loop" && b.value === !0 ? `拱顶平均温度: ${T.value}°C, 拱腰平均温度: ${A.value}°C, 平均湿度: ${z.value}%, 无法开启循环, 请检查异常传感器` : "循环养护系统未运行" : "循环养护系统未运行" : "手动模式");
    async function R(re) {
      const M = v.value;
      v.value = re === "auto", M !== v.value && (x.isPyQtWebEngine && (S("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: re } }), S("controlSprinkler", { target: "setMode", mode: v.value ? "auto" : "manual" })), v.value ? (H(), te.value && await _e(), X.value && await ve(), i.value && await Ne(), d.value && await $e()) : await be());
    }
    async function _e() {
      x.isPyQtWebEngine && (S("setEngineState", { engine: "sprayEngine", state: !te.value }), te.value = !te.value);
    }
    async function ve() {
      x.isPyQtWebEngine && (S("setEngineState", { engine: "leftSteamEngine", state: !X.value }), X.value = !X.value);
    }
    async function Ne() {
      x.isPyQtWebEngine && (S("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    async function $e() {
      x.isPyQtWebEngine && (S("setEngineState", { engine: "sprinklerEngine", state: !d.value }), d.value = !d.value);
    }
    async function Ue() {
      S("IntegratedControlSystem_set_response", { method: "click_toggleSprayEngine", args: {} }), S("setEngineState", { engine: "sprayEngine", state: !te.value }), te.value = !te.value;
    }
    async function Ae() {
      x.isPyQtWebEngine && (S("IntegratedControlSystem_set_response", { method: "click_toggleLeftSteamEngine", args: {} }), S("setEngineState", { engine: "leftSteamEngine", state: !X.value }), X.value = !X.value);
    }
    async function Pe() {
      x.isPyQtWebEngine && (S("IntegratedControlSystem_set_response", { method: "click_toggleRightSteamEngine", args: {} }), S("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    async function He() {
      x.isPyQtWebEngine && (S("IntegratedControlSystem_set_response", { method: "click_toggleSprinklerEngine", args: {} }), S("setEngineState", { engine: "sprinklerEngine", state: !d.value }), d.value = !d.value);
    }
    function et(re) {
      m.value = re, h.value = !0, g.value = re === "singleRunTime" ? u.value.toString() : re === "runIntervalTime" ? s.value.toString() : l.value.toString();
    }
    function $(re) {
      const M = parseInt(re);
      isNaN(M) || (m.value === "singleRunTime" ? (u.value = M, B()) : m.value === "runIntervalTime" ? (s.value = M, Z()) : m.value === "loopInterval" && (l.value = M, D())), m.value = null;
    }
    function B() {
      u.value = Math.max(1, u.value), r.value = u.value, ee();
    }
    function Z() {
      s.value = Math.max(0, s.value), t.value = s.value, ee();
    }
    function D() {
      l.value = Math.max(0, l.value), a.value = l.value, ee();
    }
    function ee() {
      if (x.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const re = {
          sprinkler_single_run_time: r.value,
          sprinkler_run_interval_time: t.value,
          sprinkler_loop_interval: a.value
        };
        S("controlSprinkler", { target: "settings", settings: JSON.stringify(re) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function ie() {
      S("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !v.value) && (p.value = !0, await ce());
    }
    async function be() {
      S("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), x.isPyQtWebEngine && S("controlSprinkler", { target: "setState", state: !1 }), te.value && await _e(), X.value && await ve(), i.value && await Ne(), d.value && await $e(), ge();
    }
    function ge() {
      p.value = !1, H(), c.value = "", f.value = 0;
    }
    async function ce() {
      Ee();
    }
    function Se() {
      !p.value || !v.value || (f.value--, f.value > 0 && (y = setTimeout(Se, 1e3), w.value.push(y)));
    }
    function Ee() {
      !p.value || !v.value || (c.value = "run", e.value = r.value, f.value = e.value, C.value = Date.now(), Se(), S("setEngineState", { engine: "sprinklerEngine", state: !0 }), d.value = !0, y = setTimeout(async () => {
        S("setEngineState", { engine: "sprinklerEngine", state: !1 }), d.value = !1, De();
      }, e.value * 1e3), w.value.push(y));
    }
    async function De() {
      !p.value || !v.value || (o.value = a.value, f.value = o.value, S("controlSprinkler", { target: "setState", state: !0 }), C.value = Date.now(), c.value = "loop", Se(), y = setTimeout(async () => {
        S("controlSprinkler", { target: "setState", state: !1 }), te.value && await _e(), X.value && await ve(), i.value && await Ne(), d.value && await $e(), await ce();
      }, o.value * 1e3), w.value.push(y));
    }
    return (re, M) => (we(), xe("div", Dn, [
      M[18] || (M[18] = _("h2", null, "集成控制系统【定时喷淋->循环养护->定时喷淋按时间设置交替运行】", -1)),
      M[19] || (M[19] = _("div", { class: "label-box" }, [
        _("label", null, "在数字开关上，output1控制造雾机开/关，output2控制蒸汽机（组1）开/关，output3控制（组2）蒸汽机开/关，output4控制喷淋系统开/关"),
        _("br")
      ], -1)),
      _("div", Fn, [
        _("div", Mn, [
          _("button", {
            onClick: M[0] || (M[0] = (G) => R("auto")),
            class: ot([{ active: v.value }, "mode-btn"])
          }, "自动模式", 2),
          _("button", {
            onClick: M[1] || (M[1] = (G) => R("manual")),
            class: ot([{ active: !v.value }, "mode-btn"])
          }, "手动模式", 2)
        ]),
        _("div", Vn, [
          _("button", {
            onClick: ie,
            disabled: p.value || !v.value,
            class: "control-btn"
          }, "开始", 8, Wn),
          _("button", {
            onClick: be,
            disabled: !p.value || !v.value,
            class: "control-btn"
          }, "停止", 8, qn)
        ])
      ]),
      _("div", zn, [
        _("div", Kn, [
          _("div", Qn, [
            M[6] || (M[6] = _("h3", null, "定时喷淋系统", -1)),
            _("div", Hn, [
              _("div", {
                class: ot(["status", { on: d.value }])
              }, [
                M[5] || (M[5] = _("div", { class: "status-indicator" }, null, -1)),
                ft(" " + Ce(d.value ? "开" : "关"), 1)
              ], 2),
              _("button", {
                onClick: He,
                disabled: v.value,
                class: "control-btn"
              }, Ce(d.value ? "关闭" : "开启"), 9, Yn)
            ]),
            _("div", Xn, Ce(U.value), 1)
          ]),
          _("div", Gn, [
            M[9] || (M[9] = _("h3", null, "定时喷淋/循环养护系统时间设置", -1)),
            _("div", Jn, [
              _("div", Zn, [
                M[7] || (M[7] = _("label", null, "喷淋系统工作时间 (秒):", -1)),
                _("input", {
                  type: "text",
                  value: u.value,
                  onFocus: M[2] || (M[2] = (G) => et("singleRunTime")),
                  readonly: ""
                }, null, 40, eo)
              ]),
              _("div", to, [
                M[8] || (M[8] = _("label", null, "循环养护系统工作时间 (秒):", -1)),
                _("input", {
                  type: "text",
                  value: l.value,
                  onFocus: M[3] || (M[3] = (G) => et("loopInterval")),
                  readonly: ""
                }, null, 40, no)
              ])
            ])
          ])
        ]),
        _("div", oo, [
          M[17] || (M[17] = _("h3", null, "循环养护系统", -1)),
          _("div", ro, [
            _("div", io, [
              (we(), xe("svg", ao, [
                M[10] || (M[10] = _("defs", null, [
                  _("marker", {
                    id: "arrowhead",
                    markerWidth: "10",
                    markerHeight: "7",
                    refX: "9",
                    refY: "3.5",
                    orient: "auto"
                  }, [
                    _("polygon", {
                      points: "0 0, 10 3.5, 0 7",
                      fill: "#2c3e50"
                    })
                  ])
                ], -1)),
                (we(!0), xe(rt, null, it(V.value, (G, Ke) => (we(), xe("g", {
                  key: "t" + Ke
                }, [
                  _("path", {
                    d: G.path,
                    class: "transition-path"
                  }, null, 8, so),
                  _("line", {
                    x1: G.lineStart.x,
                    y1: G.lineStart.y,
                    x2: G.conditionX,
                    y2: G.conditionY,
                    class: "condition-line"
                  }, null, 8, uo),
                  _("rect", {
                    x: G.conditionX - 80,
                    y: G.conditionY - 25,
                    width: "160",
                    height: "50",
                    rx: "4",
                    class: "condition-box"
                  }, null, 8, co),
                  _("text", {
                    x: G.conditionX,
                    y: G.conditionY - 8,
                    class: "condition-text"
                  }, Ce(G.text1), 9, lo),
                  _("text", {
                    x: G.conditionX,
                    y: G.conditionY + 8,
                    class: "condition-text"
                  }, Ce(G.text2), 9, fo)
                ]))), 128)),
                (we(!0), xe(rt, null, it(F.value, (G, Ke) => (we(), xe("g", {
                  key: Ke,
                  class: ot({ active: O.value === G.label })
                }, [
                  _("ellipse", {
                    cx: G.x,
                    cy: G.y,
                    rx: "80",
                    ry: "40",
                    class: ot(["state", { active: O.value === G.label }])
                  }, null, 10, po),
                  _("text", {
                    x: G.x,
                    y: G.y - 8,
                    class: "state-text"
                  }, Ce(G.text1), 9, vo),
                  _("text", {
                    x: G.x,
                    y: G.y + 8,
                    class: "state-text"
                  }, Ce(G.text2), 9, ho)
                ], 2))), 128))
              ]))
            ])
          ]),
          _("div", mo, [
            _("div", go, [
              _("div", yo, [
                M[12] || (M[12] = _("h4", null, "蒸汽机（组1）", -1)),
                _("div", bo, [
                  _("div", {
                    class: ot(["status", { on: X.value }])
                  }, [
                    M[11] || (M[11] = _("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + Ce(X.value ? "开" : "关"), 1)
                  ], 2),
                  _("button", {
                    onClick: Ae,
                    disabled: v.value,
                    class: "control-btn"
                  }, Ce(X.value ? "关闭" : "开启"), 9, wo)
                ])
              ]),
              _("div", xo, [
                M[14] || (M[14] = _("h4", null, "蒸汽机（组2）", -1)),
                _("div", ko, [
                  _("div", {
                    class: ot(["status", { on: i.value }])
                  }, [
                    M[13] || (M[13] = _("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + Ce(i.value ? "开" : "关"), 1)
                  ], 2),
                  _("button", {
                    onClick: Pe,
                    disabled: v.value,
                    class: "control-btn"
                  }, Ce(i.value ? "关闭" : "开启"), 9, _o)
                ])
              ]),
              _("div", So, [
                M[16] || (M[16] = _("h4", null, "超声波造雾机", -1)),
                _("div", Oo, [
                  _("div", {
                    class: ot(["status", { on: te.value }])
                  }, [
                    M[15] || (M[15] = _("div", { class: "status-indicator" }, null, -1)),
                    ft(" " + Ce(te.value ? "开" : "关"), 1)
                  ], 2),
                  _("button", {
                    onClick: Ue,
                    disabled: v.value,
                    class: "control-btn"
                  }, Ce(te.value ? "关闭" : "开启"), 9, Eo)
                ])
              ])
            ])
          ]),
          _("div", jo, Ce(ne.value), 1)
        ])
      ]),
      Ze(Ot, {
        modelValue: g.value,
        showKeyboard: h.value,
        "onUpdate:modelValue": $,
        "onUpdate:showKeyboard": M[4] || (M[4] = (G) => h.value = G)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, To = /* @__PURE__ */ vt(Co, [["__scopeId", "data-v-90556016"]]), Lo = { class: "data-actions" }, Ao = {
  key: 0,
  class: "modal-overlay"
}, No = { class: "modal-content settings-modal" }, Po = { class: "setting-group" }, $o = { class: "setting-item" }, Bo = { class: "toggle-switch" }, Io = {
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
  setup(ke) {
    const { sendToPyQt: te } = tt(), X = bt({
      isPyQtWebEngine: !1
    }), i = Y(!1), d = Y(!1), e = Y(""), n = Y(!1), o = Y(!1), r = Y(!1), t = Y(!1), a = Y(""), u = Y(!1), s = () => {
      t.value = !0, a.value = "", document.body.style.overflow = "hidden";
    }, l = () => {
      if (!a.value) {
        S("请输入更新版号！");
        return;
      }
      X.isPyQtWebEngine && te("updateVersion", { version: a.value }), t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, c = () => {
      t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      r.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, v = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, p = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto", X.isPyQtWebEngine && te("saveDebugSettings", { debug_mode: o.value });
    };
    ht(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: x } = tt();
        lt(x, (w) => {
          if (w && w.type === "update_debug_mode")
            try {
              const y = JSON.parse(w.content);
              o.value = y.debug_mode, r.value = y.debug_mode;
            } catch (y) {
              console.error("Failed to parse debug settings:", y);
            }
          else if (w && w.type === "DataExport_init") {
            const y = {
              debugMode: o.value
            };
            console.log("Sending initial DataExport state:", y), te("DataExport_init_response", y);
          } else if (w && w.type === "clearData")
            te("exportData", !1), te("clearData_response", "");
          else if (w && w.type === "updateVersion_response")
            try {
              const y = JSON.parse(w.content);
              y.status === "success" ? S(`${y.message}，系统即将重启...`) : S(y.message);
            } catch (y) {
              S("解析更新响应失败：" + y);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const h = () => {
      X.isPyQtWebEngine && (console.log("导出数据"), te("exportData", !0));
    }, m = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, g = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, b = () => {
      console.log("清空数据"), i.value = !1, S("所有数据已清空！"), document.body.style.overflow = "auto", X.isPyQtWebEngine && te("exportData", !1);
    }, S = (x) => {
      e.value = x, d.value = !0;
    }, C = () => {
      d.value = !1;
    };
    return (x, w) => (we(), xe("div", Lo, [
      _("div", { class: "action-buttons" }, [
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: h,
            class: "export-btn"
          }, "导出数据")
        ]),
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: m,
            class: "clear-btn"
          }, "清空数据")
        ]),
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: f,
            class: "settings-btn"
          }, "开发者模式")
        ]),
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: s,
            class: "update-btn"
          }, "更新")
        ])
      ]),
      n.value ? (we(), xe("div", Ao, [
        _("div", No, [
          _("div", Po, [
            w[7] || (w[7] = _("h2", null, "传感器调试模式【开发者测试用】", -1)),
            _("div", $o, [
              w[6] || (w[6] = _("span", { class: "setting-label" }, "调试模式：", -1)),
              _("div", Bo, [
                pt(_("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": w[0] || (w[0] = (y) => r.value = y)
                }, null, 512), [
                  [It, r.value]
                ]),
                w[5] || (w[5] = _("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            _("div", { class: "modal-buttons" }, [
              _("button", {
                onClick: p,
                class: "confirm-btn"
              }, "保存"),
              _("button", {
                onClick: v,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : ct("", !0),
      i.value ? (we(), xe("div", Io, [
        _("div", { class: "modal-content" }, [
          w[8] || (w[8] = _("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: b,
              class: "confirm-btn"
            }, "确定"),
            _("button", {
              onClick: g,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      t.value ? (we(), xe("div", Ro, [
        _("div", Uo, [
          w[9] || (w[9] = _("h2", null, "更新版本", -1)),
          _("div", {
            class: "update-input",
            onClick: w[2] || (w[2] = (y) => u.value = !0)
          }, [
            pt(_("input", {
              type: "text",
              "onUpdate:modelValue": w[1] || (w[1] = (y) => a.value = y),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [mt, a.value]
            ])
          ]),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: l,
              class: "confirm-btn"
            }, "更新"),
            _("button", {
              onClick: c,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      Ze(Ot, {
        modelValue: a.value,
        "onUpdate:modelValue": w[3] || (w[3] = (y) => a.value = y),
        "show-keyboard": u.value,
        "onUpdate:showKeyboard": w[4] || (w[4] = (y) => u.value = y)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (we(), xe("div", Do, [
        _("div", Fo, [
          _("h2", null, Ce(e.value), 1),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ct("", !0)
    ]));
  }
}, Vo = /* @__PURE__ */ vt(Mo, [["__scopeId", "data-v-d87ac98e"]]);
var Wo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function qo(ke) {
  return ke && ke.__esModule && Object.prototype.hasOwnProperty.call(ke, "default") ? ke.default : ke;
}
var Nt = { exports: {} };
(function(ke, te) {
  (function(X, i) {
    ke.exports = i(Bt);
  })(typeof self < "u" ? self : Wo, function(X) {
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
        if (e.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: n }), 2 & o && typeof n != "string") for (var t in n) e.d(r, t, (function(a) {
          return n[a];
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
            return function(a) {
              return o.call(r, a);
            };
          case 2:
            return function(a, u) {
              return o.call(r, a, u);
            };
          case 3:
            return function(a, u, s) {
              return o.call(r, a, u, s);
            };
        }
        return function() {
          return o.apply(r, arguments);
        };
      };
    }, "057f": function(i, d, e) {
      var n = e("fc6a"), o = e("241c").f, r = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], a = function(u) {
        try {
          return o(u);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(u) {
        return t && r.call(u) == "[object Window]" ? a(u) : o(n(u));
      };
    }, "06cf": function(i, d, e) {
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), a = e("c04e"), u = e("5135"), s = e("0cfb"), l = Object.getOwnPropertyDescriptor;
      d.f = n ? l : function(c, f) {
        if (c = t(c), f = a(f, !0), s) try {
          return l(c, f);
        } catch {
        }
        if (u(c, f)) return r(!o.f.call(c, f), c[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), a = e("4a7b");
      function u(s) {
        this.defaults = s, this.interceptors = { request: new r(), response: new r() };
      }
      u.prototype.request = function(s) {
        typeof s == "string" ? (s = arguments[1] || {}, s.url = arguments[0]) : s = s || {}, s = a(this.defaults, s), s.method ? s.method = s.method.toLowerCase() : this.defaults.method ? s.method = this.defaults.method.toLowerCase() : s.method = "get";
        var l = [t, void 0], c = Promise.resolve(s);
        for (this.interceptors.request.forEach(function(f) {
          l.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          l.push(f.fulfilled, f.rejected);
        }); l.length; ) c = c.then(l.shift(), l.shift());
        return c;
      }, u.prototype.getUri = function(s) {
        return s = a(this.defaults, s), o(s.url, s.params, s.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(s) {
        u.prototype[s] = function(l, c) {
          return this.request(a(c || {}, { method: s, url: l, data: (c || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(s) {
        u.prototype[s] = function(l, c, f) {
          return this.request(a(f || {}, { method: s, url: l, data: c }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, a = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, s, l, c, f, v) {
        var p = l + u.length, h = c.length, m = a;
        return f !== void 0 && (f = n(f), m = t), r.call(v, m, function(g, b) {
          var S;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return s.slice(0, l);
            case "'":
              return s.slice(p);
            case "<":
              S = f[b.slice(1, -1)];
              break;
            default:
              var C = +b;
              if (C === 0) return g;
              if (C > h) {
                var x = o(C / 10);
                return x === 0 ? g : x <= h ? c[x - 1] === void 0 ? b.charAt(1) : c[x - 1] + b.charAt(1) : g;
              }
              S = c[C - 1];
          }
          return S === void 0 ? "" : S;
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
        var t = String(o(this)), a = "", u = n(r);
        if (u < 0 || u == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (t += t)) 1 & u && (a += t);
        return a;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), a = e("4840"), u = e("8aa5"), s = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), v = [].push, p = Math.min, h = 4294967295, m = !f(function() {
        return !RegExp(h, "y");
      });
      n("split", 2, function(g, b, S) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, w) {
          var y = String(t(this)), j = w === void 0 ? h : w >>> 0;
          if (j === 0) return [];
          if (x === void 0) return [y];
          if (!o(x)) return b.call(y, x, j);
          for (var E, L, O, F = [], V = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), J = 0, ae = new RegExp(x.source, V + "g"); (E = c.call(ae, y)) && (L = ae.lastIndex, !(L > J && (F.push(y.slice(J, E.index)), E.length > 1 && E.index < y.length && v.apply(F, E.slice(1)), O = E[0].length, J = L, F.length >= j))); )
            ae.lastIndex === E.index && ae.lastIndex++;
          return J === y.length ? !O && ae.test("") || F.push("") : F.push(y.slice(J)), F.length > j ? F.slice(0, j) : F;
        } : "0".split(void 0, 0).length ? function(x, w) {
          return x === void 0 && w === 0 ? [] : b.call(this, x, w);
        } : b, [function(x, w) {
          var y = t(this), j = x == null ? void 0 : x[g];
          return j !== void 0 ? j.call(x, y, w) : C.call(String(y), x, w);
        }, function(x, w) {
          var y = S(C, x, this, w, C !== b);
          if (y.done) return y.value;
          var j = r(x), E = String(this), L = a(j, RegExp), O = j.unicode, F = (j.ignoreCase ? "i" : "") + (j.multiline ? "m" : "") + (j.unicode ? "u" : "") + (m ? "y" : "g"), V = new L(m ? j : "^(?:" + j.source + ")", F), J = w === void 0 ? h : w >>> 0;
          if (J === 0) return [];
          if (E.length === 0) return l(V, E) === null ? [E] : [];
          for (var ae = 0, H = 0, W = []; H < E.length; ) {
            V.lastIndex = m ? H : 0;
            var U, T = l(V, m ? E : E.slice(H));
            if (T === null || (U = p(s(V.lastIndex + (m ? 0 : H)), E.length)) === ae) H = u(E, H, O);
            else {
              if (W.push(E.slice(ae, H)), W.length === J) return W;
              for (var A = 1; A <= T.length - 1; A++) if (W.push(T[A]), W.length === J) return W;
              H = ae = U;
            }
          }
          return W.push(E.slice(ae)), W;
        }];
      }, !m);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), a = e("605d"), u = r("reduce"), s = !a && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || s }, { reduce: function(l) {
        return o(this, l, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, d, e) {
      var n = e("c6b6"), o = e("9263");
      i.exports = function(r, t) {
        var a = r.exec;
        if (typeof a == "function") {
          var u = a.call(r, t);
          if (typeof u != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return u;
        }
        if (n(r) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return o.call(r, t);
      };
    }, "159b": function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("17c2"), t = e("9112");
      for (var a in o) {
        var u = n[a], s = u && u.prototype;
        if (s && s.forEach !== r) try {
          t(s, "forEach", r);
        } catch {
          s.forEach = r;
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
        var t = 0, a = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          r = !0;
        } };
        a[o] = function() {
          return this;
        }, Array.from(a, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(u, s) {
        if (!s && !r) return !1;
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
      i.exports = function(a) {
        return r >= 51 || !n(function() {
          var u = [], s = u.constructor = {};
          return s[t] = function() {
            return { foo: 1 };
          }, u[a](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          function o($, B) {
            return B = { exports: {} }, $(B, B.exports), B.exports;
          }
          var r = o(function($, B) {
            (function(Z, D) {
              $.exports = D();
            })(0, function() {
              function Z(ce) {
                var Se = ce && typeof ce == "object";
                return Se && Object.prototype.toString.call(ce) !== "[object RegExp]" && Object.prototype.toString.call(ce) !== "[object Date]";
              }
              function D(ce) {
                return Array.isArray(ce) ? [] : {};
              }
              function ee(ce, Se) {
                var Ee = Se && Se.clone === !0;
                return Ee && Z(ce) ? ge(D(ce), ce, Se) : ce;
              }
              function ie(ce, Se, Ee) {
                var De = ce.slice();
                return Se.forEach(function(re, M) {
                  typeof De[M] > "u" ? De[M] = ee(re, Ee) : Z(re) ? De[M] = ge(ce[M], re, Ee) : ce.indexOf(re) === -1 && De.push(ee(re, Ee));
                }), De;
              }
              function be(ce, Se, Ee) {
                var De = {};
                return Z(ce) && Object.keys(ce).forEach(function(re) {
                  De[re] = ee(ce[re], Ee);
                }), Object.keys(Se).forEach(function(re) {
                  Z(Se[re]) && ce[re] ? De[re] = ge(ce[re], Se[re], Ee) : De[re] = ee(Se[re], Ee);
                }), De;
              }
              function ge(ce, Se, Ee) {
                var De = Array.isArray(Se), re = Ee || { arrayMerge: ie }, M = re.arrayMerge || ie;
                return De ? Array.isArray(ce) ? M(ce, Se, Ee) : ee(Se, Ee) : be(ce, Se, Ee);
              }
              return ge.all = function(ce, Se) {
                if (!Array.isArray(ce) || ce.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ce.reduce(function(Ee, De) {
                  return ge(Ee, De, Se);
                });
              }, ge;
            });
          });
          function t($) {
            return $ = $ || /* @__PURE__ */ Object.create(null), { on: function(B, Z) {
              ($[B] || ($[B] = [])).push(Z);
            }, off: function(B, Z) {
              $[B] && $[B].splice($[B].indexOf(Z) >>> 0, 1);
            }, emit: function(B, Z) {
              ($[B] || []).map(function(D) {
                D(Z);
              }), ($["*"] || []).map(function(D) {
                D(B, Z);
              });
            } };
          }
          var a = o(function($, B) {
            var Z = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            B.default = Z, $.exports = B.default;
          }), u = function($) {
            return Object.keys($).map(function(B) {
              var Z = $[B].toString().replace(/"/g, "&quot;");
              return B + '="' + Z + '"';
            }).join(" ");
          }, s = a.svg, l = a.xlink, c = {};
          c[s.name] = s.uri, c[l.name] = l.uri;
          var f, v = function($, B) {
            $ === void 0 && ($ = "");
            var Z = r(c, B || {}), D = u(Z);
            return "<svg " + D + ">" + $ + "</svg>";
          }, p = a.svg, h = a.xlink, m = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[h.name] = h.uri, f) }, g = function($) {
            this.config = r(m, $ || {}), this.symbols = [];
          };
          g.prototype.add = function($) {
            var B = this, Z = B.symbols, D = this.find($.id);
            return D ? (Z[Z.indexOf(D)] = $, !1) : (Z.push($), !0);
          }, g.prototype.remove = function($) {
            var B = this, Z = B.symbols, D = this.find($);
            return !!D && (Z.splice(Z.indexOf(D), 1), D.destroy(), !0);
          }, g.prototype.find = function($) {
            return this.symbols.filter(function(B) {
              return B.id === $;
            })[0] || null;
          }, g.prototype.has = function($) {
            return this.find($) !== null;
          }, g.prototype.stringify = function() {
            var $ = this.config, B = $.attrs, Z = this.symbols.map(function(D) {
              return D.stringify();
            }).join("");
            return v(Z, B);
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            this.symbols.forEach(function($) {
              return $.destroy();
            });
          };
          var b = function($) {
            var B = $.id, Z = $.viewBox, D = $.content;
            this.id = B, this.viewBox = Z, this.content = D;
          };
          b.prototype.stringify = function() {
            return this.content;
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            var $ = this;
            ["id", "viewBox", "content"].forEach(function(B) {
              return delete $[B];
            });
          };
          var S = function($) {
            var B = !!document.importNode, Z = new DOMParser().parseFromString($, "image/svg+xml").documentElement;
            return B ? document.importNode(Z, !0) : Z;
          }, C = function($) {
            function B() {
              $.apply(this, arguments);
            }
            $ && (B.__proto__ = $), B.prototype = Object.create($ && $.prototype), B.prototype.constructor = B;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, B.createFromExistingNode = function(D) {
              return new B({ id: D.getAttribute("id"), viewBox: D.getAttribute("viewBox"), content: D.outerHTML });
            }, B.prototype.destroy = function() {
              this.isMounted && this.unmount(), $.prototype.destroy.call(this);
            }, B.prototype.mount = function(D) {
              if (this.isMounted) return this.node;
              var ee = typeof D == "string" ? document.querySelector(D) : D, ie = this.render();
              return this.node = ie, ee.appendChild(ie), ie;
            }, B.prototype.render = function() {
              var D = this.stringify();
              return S(v(D)).childNodes[0];
            }, B.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(B.prototype, Z), B;
          }(b), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, w = function($) {
            return Array.prototype.slice.call($, 0);
          }, y = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, j = function($, B) {
            var Z = document.createEvent("CustomEvent");
            Z.initCustomEvent($, !1, !1, B), window.dispatchEvent(Z);
          }, E = function($) {
            var B = [];
            return w($.querySelectorAll("style")).forEach(function(Z) {
              Z.textContent += "", B.push(Z);
            }), B;
          }, L = function($) {
            return ($ || window.location.href).split("#")[0];
          }, O = function($) {
            angular.module("ng").run(["$rootScope", function(B) {
              B.$on("$locationChangeSuccess", function(Z, D, ee) {
                j($, { oldUrl: ee, newUrl: D });
              });
            }]);
          }, F = "linearGradient, radialGradient, pattern, mask, clipPath", V = function($, B) {
            return B === void 0 && (B = F), w($.querySelectorAll("symbol")).forEach(function(Z) {
              w(Z.querySelectorAll(B)).forEach(function(D) {
                Z.parentNode.insertBefore(D, Z);
              });
            }), $;
          };
          function J($, B) {
            var Z = w($).reduce(function(D, ee) {
              if (!ee.attributes) return D;
              var ie = w(ee.attributes), be = B ? ie.filter(B) : ie;
              return D.concat(be);
            }, []);
            return Z;
          }
          var ae = a.xlink.uri, H = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function U($) {
            return $.replace(W, function(B) {
              return "%" + B[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function T($) {
            return $.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A($, B, Z) {
            return w($).forEach(function(D) {
              var ee = D.getAttribute(H);
              if (ee && ee.indexOf(B) === 0) {
                var ie = ee.replace(B, Z);
                D.setAttributeNS(ae, H, ie);
              }
            }), $;
          }
          var z, ne = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], R = ne.map(function($) {
            return "[" + $ + "]";
          }).join(","), _e = function($, B, Z, D) {
            var ee = U(Z), ie = U(D), be = $.querySelectorAll(R), ge = J(be, function(ce) {
              var Se = ce.localName, Ee = ce.value;
              return ne.indexOf(Se) !== -1 && Ee.indexOf("url(" + ee) !== -1;
            });
            ge.forEach(function(ce) {
              return ce.value = ce.value.replace(new RegExp(T(ee), "g"), ie);
            }), A(B, ee, ie);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ne = function($) {
            function B(D) {
              var ee = this;
              D === void 0 && (D = {}), $.call(this, r(x, D));
              var ie = t();
              this._emitter = ie, this.node = null;
              var be = this, ge = be.config;
              if (ge.autoConfigure && this._autoConfigure(D), ge.syncUrlsWithBaseTag) {
                var ce = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(ve.MOUNT, function() {
                  return ee.updateUrls("#", ce);
                });
              }
              var Se = this._handleLocationChange.bind(this);
              this._handleLocationChange = Se, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, Se), ge.locationChangeAngularEmitter && O(ge.locationChangeEvent), ie.on(ve.MOUNT, function(Ee) {
                ge.moveGradientsOutsideSymbol && V(Ee);
              }), ie.on(ve.SYMBOL_MOUNT, function(Ee) {
                ge.moveGradientsOutsideSymbol && V(Ee.parentNode), (y.isIE() || y.isEdge()) && E(Ee);
              });
            }
            $ && (B.__proto__ = $), B.prototype = Object.create($ && $.prototype), B.prototype.constructor = B;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, B.prototype._autoConfigure = function(D) {
              var ee = this, ie = ee.config;
              typeof D.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof D.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof D.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = y.isFirefox());
            }, B.prototype._handleLocationChange = function(D) {
              var ee = D.detail, ie = ee.oldUrl, be = ee.newUrl;
              this.updateUrls(ie, be);
            }, B.prototype.add = function(D) {
              var ee = this, ie = $.prototype.add.call(this, D);
              return this.isMounted && ie && (D.mount(ee.node), this._emitter.emit(ve.SYMBOL_MOUNT, D.node)), ie;
            }, B.prototype.attach = function(D) {
              var ee = this, ie = this;
              if (ie.isMounted) return ie.node;
              var be = typeof D == "string" ? document.querySelector(D) : D;
              return ie.node = be, this.symbols.forEach(function(ge) {
                ge.mount(ie.node), ee._emitter.emit(ve.SYMBOL_MOUNT, ge.node);
              }), w(be.querySelectorAll("symbol")).forEach(function(ge) {
                var ce = C.createFromExistingNode(ge);
                ce.node = ge, ie.add(ce);
              }), this._emitter.emit(ve.MOUNT, be), be;
            }, B.prototype.destroy = function() {
              var D = this, ee = D.config, ie = D.symbols, be = D._emitter;
              ie.forEach(function(ge) {
                return ge.destroy();
              }), be.off("*"), window.removeEventListener(ee.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, B.prototype.mount = function(D, ee) {
              D === void 0 && (D = this.config.mountTo), ee === void 0 && (ee = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var be = typeof D == "string" ? document.querySelector(D) : D, ge = ie.render();
              return this.node = ge, ee && be.childNodes[0] ? be.insertBefore(ge, be.childNodes[0]) : be.appendChild(ge), this._emitter.emit(ve.MOUNT, ge), ge;
            }, B.prototype.render = function() {
              return S(this.stringify());
            }, B.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, B.prototype.updateUrls = function(D, ee) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return _e(this.node, ie, L(D) + "#", L(ee) + "#"), !0;
            }, Object.defineProperties(B.prototype, Z), B;
          }(g), $e = o(function($) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(B, Z) {
              $.exports = Z();
            })(0, function() {
              var B, Z = [], D = document, ee = D.documentElement.doScroll, ie = "DOMContentLoaded", be = (ee ? /^loaded|^c/ : /^loaded|^i|^c/).test(D.readyState);
              return be || D.addEventListener(ie, B = function() {
                for (D.removeEventListener(ie, B), be = 1; B = Z.shift(); ) B();
              }), function(ge) {
                be ? setTimeout(ge, 0) : Z.push(ge);
              };
            });
          }), Ue = "__SVG_SPRITE_NODE__", Ae = "__SVG_SPRITE__", Pe = !!window[Ae];
          Pe ? z = window[Ae] : (z = new Ne({ attrs: { id: Ue, "aria-hidden": "true" } }), window[Ae] = z);
          var He = function() {
            var $ = document.getElementById(Ue);
            $ ? z.attach($) : z.mount(document.body, !0);
          };
          document.body ? He() : $e(He);
          var et = z;
          return et;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), a = e("35a1"), u = e("2a62"), s = function(l, c) {
        this.stopped = l, this.result = c;
      };
      i.exports = function(l, c, f) {
        var v, p, h, m, g, b, S, C = f && f.that, x = !(!f || !f.AS_ENTRIES), w = !(!f || !f.IS_ITERATOR), y = !(!f || !f.INTERRUPTED), j = t(c, C, 1 + x + y), E = function(O) {
          return v && u(v), new s(!0, O);
        }, L = function(O) {
          return x ? (n(O), y ? j(O[0], O[1], E) : j(O[0], O[1])) : y ? j(O, E) : j(O);
        };
        if (w) v = l;
        else {
          if (p = a(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (o(p)) {
            for (h = 0, m = r(l.length); m > h; h++) if (g = L(l[h]), g && g instanceof s) return g;
            return new s(!1);
          }
          v = p.call(l);
        }
        for (b = v.next; !(S = b.call(v)).done; ) {
          try {
            g = L(S.value);
          } catch (O) {
            throw u(v), O;
          }
          if (typeof g == "object" && g && g instanceof s) return g;
        }
        return new s(!1);
      };
    }, "23cb": function(i, d, e) {
      var n = e("a691"), o = Math.max, r = Math.min;
      i.exports = function(t, a) {
        var u = n(t);
        return u < 0 ? o(u + a, 0) : r(u, a);
      };
    }, "23e7": function(i, d, e) {
      var n = e("da84"), o = e("06cf").f, r = e("9112"), t = e("6eeb"), a = e("ce4e"), u = e("e893"), s = e("94ca");
      i.exports = function(l, c) {
        var f, v, p, h, m, g, b = l.target, S = l.global, C = l.stat;
        if (v = S ? n : C ? n[b] || a(b, {}) : (n[b] || {}).prototype, v) for (p in c) {
          if (m = c[p], l.noTargetGet ? (g = o(v, p), h = g && g.value) : h = v[p], f = s(S ? p : b + (C ? "." : "#") + p, l.forced), !f && h !== void 0) {
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
        function a(l, c) {
          !o.isUndefined(l) && o.isUndefined(l["Content-Type"]) && (l["Content-Type"] = c);
        }
        function u() {
          var l;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (l = e("b50d")), l;
        }
        var s = { adapter: u(), transformRequest: [function(l, c) {
          return r(c, "Accept"), r(c, "Content-Type"), o.isFormData(l) || o.isArrayBuffer(l) || o.isBuffer(l) || o.isStream(l) || o.isFile(l) || o.isBlob(l) ? l : o.isArrayBufferView(l) ? l.buffer : o.isURLSearchParams(l) ? (a(c, "application/x-www-form-urlencoded;charset=utf-8"), l.toString()) : o.isObject(l) ? (a(c, "application/json;charset=utf-8"), JSON.stringify(l)) : l;
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
          s.headers[l] = {};
        }), o.forEach(["post", "put", "patch"], function(l) {
          s.headers[l] = o.merge(t);
        }), i.exports = s;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(a) {
        return !!~String(r(this)).indexOf(o(a), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), a = "toString", u = RegExp.prototype, s = u[a], l = r(function() {
        return s.call({ source: "a", flags: "b" }) != "/a/b";
      }), c = s.name != a;
      (l || c) && n(RegExp.prototype, a, function() {
        var f = o(this), v = String(f.source), p = f.flags, h = String(p === void 0 && f instanceof RegExp && !("flags" in u) ? t.call(f) : p);
        return "/" + v + "/" + h;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), a = r("species");
      i.exports = function(u) {
        var s = n(u), l = o.f;
        t && s && !s[a] && l(s, a, { configurable: !0, get: function() {
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
      var n, o, r, t = e("da84"), a = e("d039"), u = e("0366"), s = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), v = t.location, p = t.setImmediate, h = t.clearImmediate, m = t.process, g = t.MessageChannel, b = t.Dispatch, S = 0, C = {}, x = "onreadystatechange", w = function(L) {
        if (C.hasOwnProperty(L)) {
          var O = C[L];
          delete C[L], O();
        }
      }, y = function(L) {
        return function() {
          w(L);
        };
      }, j = function(L) {
        w(L.data);
      }, E = function(L) {
        t.postMessage(L + "", v.protocol + "//" + v.host);
      };
      p && h || (p = function(L) {
        for (var O = [], F = 1; arguments.length > F; ) O.push(arguments[F++]);
        return C[++S] = function() {
          (typeof L == "function" ? L : Function(L)).apply(void 0, O);
        }, n(S), S;
      }, h = function(L) {
        delete C[L];
      }, f ? n = function(L) {
        m.nextTick(y(L));
      } : b && b.now ? n = function(L) {
        b.now(y(L));
      } : g && !c ? (o = new g(), r = o.port2, o.port1.onmessage = j, n = u(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && v && v.protocol !== "file:" && !a(E) ? (n = E, t.addEventListener("message", j, !1)) : n = x in l("script") ? function(L) {
        s.appendChild(l("script"))[x] = function() {
          s.removeChild(this), w(L);
        };
      } : function(L) {
        setTimeout(y(L), 0);
      }), i.exports = { set: p, clear: h };
    }, "2d00": function(i, d, e) {
      var n, o, r = e("da84"), t = e("342f"), a = r.process, u = a && a.versions, s = u && u.v8;
      s ? (n = s.split("."), o = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (o = n[1]))), i.exports = o && +o;
    }, "2d83": function(i, d, e) {
      var n = e("387f");
      i.exports = function(o, r, t, a, u) {
        var s = new Error(o);
        return n(s, r, t, a, u);
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
      i.exports = function(r, t, a) {
        if (!t) return r;
        var u;
        if (a) u = a(t);
        else if (n.isURLSearchParams(t)) u = t.toString();
        else {
          var s = [];
          n.forEach(t, function(c, f) {
            c !== null && typeof c < "u" && (n.isArray(c) ? f += "[]" : c = [c], n.forEach(c, function(v) {
              n.isDate(v) ? v = v.toISOString() : n.isObject(v) && (v = JSON.stringify(v)), s.push(o(f) + "=" + o(v));
            }));
          }), u = s.join("&");
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
      i.exports = function(a) {
        if (a != null) return a[t] || a["@@iterator"] || o[n(a)];
      };
    }, "37e8": function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(a, u) {
        r(a);
        for (var s, l = t(u), c = l.length, f = 0; c > f; ) o.f(a, s = l[f++], u[s]);
        return a;
      };
    }, "387f": function(i, d, e) {
      i.exports = function(n, o, r, t, a) {
        return n.config = o, r && (n.code = r), n.request = t, n.response = a, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, d, e) {
      e("acce");
    }, 3934: function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var o, r = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function a(u) {
          var s = u;
          return r && (t.setAttribute("href", s), s = t.href), t.setAttribute("href", s), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return o = a(window.location.href), function(u) {
          var s = n.isString(u) ? a(u) : u;
          return s.protocol === o.protocol && s.host === o.host;
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
      var n = e("6547").charAt, o = e("69f3"), r = e("7dd0"), t = "String Iterator", a = o.set, u = o.getterFor(t);
      r(String, "String", function(s) {
        a(this, { type: t, string: String(s), index: 0 });
      }, function() {
        var s, l = u(this), c = l.string, f = l.index;
        return f >= c.length ? { value: void 0, done: !0 } : (s = n(c, f), l.index += s.length, { value: s, done: !1 });
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
      var n = e("b622"), o = e("7c73"), r = e("9bf2"), t = n("unscopables"), a = Array.prototype;
      a[t] == null && r.f(a, t, { configurable: !0, value: o(null) }), i.exports = function(u) {
        a[t][u] = !0;
      };
    }, "44de": function(i, d, e) {
      var n = e("da84");
      i.exports = function(o, r) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(o) : t.error(o, r));
      };
    }, "44e7": function(i, d, e) {
      var n = e("861d"), o = e("c6b6"), r = e("b622"), t = r("match");
      i.exports = function(a) {
        var u;
        return n(a) && ((u = a[t]) !== void 0 ? !!u : o(a) == "RegExp");
      };
    }, "466d": function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("1d80"), a = e("8aa5"), u = e("14c3");
      n("match", 1, function(s, l, c) {
        return [function(f) {
          var v = t(this), p = f == null ? void 0 : f[s];
          return p !== void 0 ? p.call(f, v) : new RegExp(f)[s](String(v));
        }, function(f) {
          var v = c(l, f, this);
          if (v.done) return v.value;
          var p = o(f), h = String(this);
          if (!p.global) return u(p, h);
          var m = p.unicode;
          p.lastIndex = 0;
          for (var g, b = [], S = 0; (g = u(p, h)) !== null; ) {
            var C = String(g[0]);
            b[S] = C, C === "" && (p.lastIndex = a(h, r(p.lastIndex), m)), S++;
          }
          return S === 0 ? null : b;
        }];
      });
    }, "467f": function(i, d, e) {
      var n = e("2d83");
      i.exports = function(o, r, t) {
        var a = t.config.validateStatus;
        t.status && a && !a(t.status) ? r(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : o(t);
      };
    }, 4840: function(i, d, e) {
      var n = e("825a"), o = e("1c0b"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s, l = n(a).constructor;
        return l === void 0 || (s = n(l)[t]) == null ? u : o(s);
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
        var t = {}, a = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], s = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], l = ["validateStatus"];
        function c(h, m) {
          return n.isPlainObject(h) && n.isPlainObject(m) ? n.merge(h, m) : n.isPlainObject(m) ? n.merge({}, m) : n.isArray(m) ? m.slice() : m;
        }
        function f(h) {
          n.isUndefined(r[h]) ? n.isUndefined(o[h]) || (t[h] = c(void 0, o[h])) : t[h] = c(o[h], r[h]);
        }
        n.forEach(a, function(h) {
          n.isUndefined(r[h]) || (t[h] = c(void 0, r[h]));
        }), n.forEach(u, f), n.forEach(s, function(h) {
          n.isUndefined(r[h]) ? n.isUndefined(o[h]) || (t[h] = c(void 0, o[h])) : t[h] = c(void 0, r[h]);
        }), n.forEach(l, function(h) {
          h in r ? t[h] = c(o[h], r[h]) : h in o && (t[h] = c(void 0, o[h]));
        });
        var v = a.concat(u).concat(s).concat(l), p = Object.keys(o).concat(Object.keys(r)).filter(function(h) {
          return v.indexOf(h) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), a = e("9bf2").f, u = e("241c").f, s = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), v = e("d039"), p = e("69f3").set, h = e("2626"), m = e("b622"), g = m("match"), b = o.RegExp, S = b.prototype, C = /a/g, x = /a/g, w = new b(C) !== C, y = c.UNSUPPORTED_Y, j = n && r("RegExp", !w || y || v(function() {
        return x[g] = !1, b(C) != C || b(x) == x || b(C, "i") != "/a/i";
      }));
      if (j) {
        for (var E = function(V, J) {
          var ae, H = this instanceof E, W = s(V), U = J === void 0;
          if (!H && W && V.constructor === E && U) return V;
          w ? W && !U && (V = V.source) : V instanceof E && (U && (J = l.call(V)), V = V.source), y && (ae = !!J && J.indexOf("y") > -1, ae && (J = J.replace(/y/g, "")));
          var T = t(w ? new b(V, J) : b(V, J), H ? this : S, E);
          return y && ae && p(T, { sticky: ae }), T;
        }, L = function(V) {
          V in E || a(E, V, { configurable: !0, get: function() {
            return b[V];
          }, set: function(J) {
            b[V] = J;
          } });
        }, O = u(b), F = 0; O.length > F; ) L(O[F++]);
        S.constructor = E, E.prototype = S, f(o, "RegExp", E);
      }
      h("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(a) {
        return function(u, s, l) {
          var c, f = n(u), v = o(f.length), p = r(l, v);
          if (a && s != s) {
            for (; v > p; ) if (c = f[p++], c != c) return !0;
          } else for (; v > p; p++) if ((a || p in f) && f[p] === s) return a || p || 0;
          return !a && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, d, e) {
      var n = e("23e7"), o = e("b727").filter, r = e("1dde"), t = r("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(a) {
        return o(this, a, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, d, e) {
      var n = e("0366"), o = e("7b0b"), r = e("9bdd"), t = e("e95a"), a = e("50c4"), u = e("8418"), s = e("35a1");
      i.exports = function(l) {
        var c, f, v, p, h, m, g = o(l), b = typeof this == "function" ? this : Array, S = arguments.length, C = S > 1 ? arguments[1] : void 0, x = C !== void 0, w = s(g), y = 0;
        if (x && (C = n(C, S > 2 ? arguments[2] : void 0, 2)), w == null || b == Array && t(w)) for (c = a(g.length), f = new b(c); c > y; y++) m = x ? C(g[y], y) : g[y], u(f, y, m);
        else for (p = w.call(g), h = p.next, f = new b(); !(v = h.call(p)).done; y++) m = x ? r(p, C, [v.value, y], !0) : v.value, u(f, y, m);
        return f.length = y, f;
      };
    }, "4f43": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
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
      t.a.add(a), d.default = a;
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
      function a(u) {
        u.cancelToken && u.cancelToken.throwIfRequested();
      }
      i.exports = function(u) {
        a(u), u.headers = u.headers || {}, u.data = o(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(l) {
          delete u.headers[l];
        });
        var s = u.adapter || t.adapter;
        return s(u).then(function(l) {
          return a(u), l.data = o(l.data, l.headers, u.transformResponse), l;
        }, function(l) {
          return r(l) || (a(u), l && l.response && (l.response.data = o(l.response.data, l.response.headers, u.transformResponse))), Promise.reject(l);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), a = e("1d80"), u = e("8aa5"), s = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, v = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, h, m, g) {
        var b = g.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, S = g.REPLACE_KEEPS_$0, C = b ? "$" : "$0";
        return [function(x, w) {
          var y = a(this), j = x == null ? void 0 : x[p];
          return j !== void 0 ? j.call(x, y, w) : h.call(String(y), x, w);
        }, function(x, w) {
          if (!b && S || typeof w == "string" && w.indexOf(C) === -1) {
            var y = m(h, x, this, w);
            if (y.done) return y.value;
          }
          var j = o(x), E = String(this), L = typeof w == "function";
          L || (w = String(w));
          var O = j.global;
          if (O) {
            var F = j.unicode;
            j.lastIndex = 0;
          }
          for (var V = []; ; ) {
            var J = l(j, E);
            if (J === null || (V.push(J), !O)) break;
            var ae = String(J[0]);
            ae === "" && (j.lastIndex = u(E, r(j.lastIndex), F));
          }
          for (var H = "", W = 0, U = 0; U < V.length; U++) {
            J = V[U];
            for (var T = String(J[0]), A = c(f(t(J.index), E.length), 0), z = [], ne = 1; ne < J.length; ne++) z.push(v(J[ne]));
            var R = J.groups;
            if (L) {
              var _e = [T].concat(z, A, E);
              R !== void 0 && _e.push(R);
              var ve = String(w.apply(void 0, _e));
            } else ve = s(T, E, A, z, R, w);
            A >= W && (H += E.slice(W, A) + ve, W = A + T.length);
          }
          return H + E.slice(W);
        }];
      });
    }, "545a": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, 5530: function(i, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, o) {
        var r = n.document, t = r.documentElement, a = r.querySelector('meta[name="viewport"]'), u = r.querySelector('meta[name="flexible"]'), s = 0, l = 0, c = o.flexible || (o.flexible = {});
        if (a) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = a.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (l = parseFloat(f[1]), s = parseInt(1 / l));
        } else if (u) {
          var v = u.getAttribute("content");
          if (v) {
            var p = v.match(/initial\-dpr=([\d\.]+)/), h = v.match(/maximum\-dpr=([\d\.]+)/);
            p && (s = parseFloat(p[1]), l = parseFloat((1 / s).toFixed(2))), h && (s = parseFloat(h[1]), l = parseFloat((1 / s).toFixed(2)));
          }
        }
        if (!s && !l) {
          n.navigator.appVersion.match(/android/gi);
          var m = n.navigator.appVersion.match(/iphone/gi), g = n.devicePixelRatio;
          s = m ? g >= 3 && (!s || s >= 3) ? 3 : g >= 2 && (!s || s >= 2) ? 2 : 1 : 1, l = 1 / s;
        }
        if (t.setAttribute("data-dpr", s), !a) if (a = r.createElement("meta"), a.setAttribute("name", "viewport"), a.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(a);
        else {
          var b = r.createElement("div");
          b.appendChild(a), r.write(b.innerHTML);
        }
        function S() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", c.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          S();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && S();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * s + "px" : r.addEventListener("DOMContentLoaded", function(C) {
          r.body.style.fontSize = 10 * s + "px";
        }, !1), S(), c.dpr = n.dpr = s, c.refreshRem = S, c.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, c.px2rem = function(C) {
          var x = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (x += "rem"), x;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, d, e) {
      var n = e("c430"), o = e("c6cd");
      (i.exports = function(r, t) {
        return o[r] || (o[r] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, d, e) {
      var n = e("d066"), o = e("241c"), r = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(a) {
        var u = o.f(t(a)), s = r.f;
        return s ? u.concat(s(a)) : u;
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
        return function(a, u) {
          var s, l, c = String(o(a)), f = n(u), v = c.length;
          return f < 0 || f >= v ? t ? "" : void 0 : (s = c.charCodeAt(f), s < 55296 || s > 56319 || f + 1 === v || (l = c.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? c.charAt(f) : s : t ? c.slice(f, f + 2) : l - 56320 + (s - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), a = e("19aa"), u = e("2266"), s = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, v = e("69f3"), p = v.set, h = v.getterFor;
      i.exports = { getConstructor: function(m, g, b, S) {
        var C = m(function(j, E) {
          a(j, C, g), p(j, { type: g, index: o(null), first: void 0, last: void 0, size: 0 }), c || (j.size = 0), E != null && u(E, j[S], { that: j, AS_ENTRIES: b });
        }), x = h(g), w = function(j, E, L) {
          var O, F, V = x(j), J = y(j, E);
          return J ? J.value = L : (V.last = J = { index: F = f(E, !0), key: E, value: L, previous: O = V.last, next: void 0, removed: !1 }, V.first || (V.first = J), O && (O.next = J), c ? V.size++ : j.size++, F !== "F" && (V.index[F] = J)), j;
        }, y = function(j, E) {
          var L, O = x(j), F = f(E);
          if (F !== "F") return O.index[F];
          for (L = O.first; L; L = L.next) if (L.key == E) return L;
        };
        return r(C.prototype, { clear: function() {
          for (var j = this, E = x(j), L = E.index, O = E.first; O; ) O.removed = !0, O.previous && (O.previous = O.previous.next = void 0), delete L[O.index], O = O.next;
          E.first = E.last = void 0, c ? E.size = 0 : j.size = 0;
        }, delete: function(j) {
          var E = this, L = x(E), O = y(E, j);
          if (O) {
            var F = O.next, V = O.previous;
            delete L.index[O.index], O.removed = !0, V && (V.next = F), F && (F.previous = V), L.first == O && (L.first = F), L.last == O && (L.last = V), c ? L.size-- : E.size--;
          }
          return !!O;
        }, forEach: function(j) {
          for (var E, L = x(this), O = t(j, arguments.length > 1 ? arguments[1] : void 0, 3); E = E ? E.next : L.first; )
            for (O(E.value, E.key, this); E && E.removed; ) E = E.previous;
        }, has: function(j) {
          return !!y(this, j);
        } }), r(C.prototype, b ? { get: function(j) {
          var E = y(this, j);
          return E && E.value;
        }, set: function(j, E) {
          return w(this, j === 0 ? 0 : j, E);
        } } : { add: function(j) {
          return w(this, j = j === 0 ? 0 : j, j);
        } }), c && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(m, g, b) {
        var S = g + " Iterator", C = h(g), x = h(S);
        s(m, g, function(w, y) {
          p(this, { type: S, target: w, state: C(w), kind: y, last: void 0 });
        }, function() {
          for (var w = x(this), y = w.kind, j = w.last; j && j.removed; ) j = j.previous;
          return w.target && (w.last = j = j ? j.next : w.state.first) ? y == "keys" ? { value: j.key, done: !1 } : y == "values" ? { value: j.value, done: !1 } : { value: [j.key, j.value], done: !1 } : (w.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), l(g);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s;
        return o(a) && (s = a.constructor, typeof s != "function" || s !== Array && !o(s.prototype) ? n(s) && (s = s[t], s === null && (s = void 0)) : s = void 0), new (s === void 0 ? Array : s)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), a = e("da84"), u = e("861d"), s = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), v = e("d012"), p = a.WeakMap, h = function(w) {
        return r(w) ? o(w) : n(w, {});
      }, m = function(w) {
        return function(y) {
          var j;
          if (!u(y) || (j = o(y)).type !== w) throw TypeError("Incompatible receiver, " + w + " required");
          return j;
        };
      };
      if (t) {
        var g = c.state || (c.state = new p()), b = g.get, S = g.has, C = g.set;
        n = function(w, y) {
          return y.facade = w, C.call(g, w, y), y;
        }, o = function(w) {
          return b.call(g, w) || {};
        }, r = function(w) {
          return S.call(g, w);
        };
      } else {
        var x = f("state");
        v[x] = !0, n = function(w, y) {
          return y.facade = w, s(w, x, y), y;
        }, o = function(w) {
          return l(w, x) ? w[x] : {};
        }, r = function(w) {
          return l(w, x);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: h, getterFor: m };
    }, "6d55": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, "6d61": function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), a = e("f183"), u = e("2266"), s = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), v = e("d44e"), p = e("7156");
      i.exports = function(h, m, g) {
        var b = h.indexOf("Map") !== -1, S = h.indexOf("Weak") !== -1, C = b ? "set" : "add", x = o[h], w = x && x.prototype, y = x, j = {}, E = function(H) {
          var W = w[H];
          t(w, H, H == "add" ? function(U) {
            return W.call(this, U === 0 ? 0 : U), this;
          } : H == "delete" ? function(U) {
            return !(S && !l(U)) && W.call(this, U === 0 ? 0 : U);
          } : H == "get" ? function(U) {
            return S && !l(U) ? void 0 : W.call(this, U === 0 ? 0 : U);
          } : H == "has" ? function(U) {
            return !(S && !l(U)) && W.call(this, U === 0 ? 0 : U);
          } : function(U, T) {
            return W.call(this, U === 0 ? 0 : U, T), this;
          });
        }, L = r(h, typeof x != "function" || !(S || w.forEach && !c(function() {
          new x().entries().next();
        })));
        if (L) y = g.getConstructor(m, h, b, C), a.REQUIRED = !0;
        else if (r(h, !0)) {
          var O = new y(), F = O[C](S ? {} : -0, 1) != O, V = c(function() {
            O.has(1);
          }), J = f(function(H) {
            new x(H);
          }), ae = !S && c(function() {
            for (var H = new x(), W = 5; W--; ) H[C](W, W);
            return !H.has(-0);
          });
          J || (y = m(function(H, W) {
            s(H, y, h);
            var U = p(new x(), H, y);
            return W != null && u(W, U[C], { that: U, AS_ENTRIES: b }), U;
          }), y.prototype = w, w.constructor = y), (V || ae) && (E("delete"), E("has"), b && E("get")), (ae || F) && E(C), S && w.clear && delete w.clear;
        }
        return j[h] = y, n({ global: !0, forced: y != x }, j), v(y, h), S || g.setStrong(y, h, b), y;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), a = e("8925"), u = e("69f3"), s = u.get, l = u.enforce, c = String(String).split("String");
      (i.exports = function(f, v, p, h) {
        var m, g = !!h && !!h.unsafe, b = !!h && !!h.enumerable, S = !!h && !!h.noTargetGet;
        typeof p == "function" && (typeof v != "string" || r(p, "name") || o(p, "name", v), m = l(p), m.source || (m.source = c.join(typeof v == "string" ? v : ""))), f !== n ? (g ? !S && f[v] && (b = !0) : delete f[v], b ? f[v] = p : o(f, v, p)) : b ? f[v] = p : t(v, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && s(this).source || a(this);
      });
    }, "70d3": function(i, d, e) {
    }, 7156: function(i, d, e) {
      var n = e("861d"), o = e("d2bb");
      i.exports = function(r, t, a) {
        var u, s;
        return o && typeof (u = t.constructor) == "function" && u !== a && n(s = u.prototype) && s !== a.prototype && o(r, s), r;
      };
    }, 7305: function(i, d, e) {
    }, 7320: function(i, d, e) {
    }, 7418: function(i, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, d, e) {
      var n = e("428f"), o = e("5135"), r = e("e538"), t = e("9bf2").f;
      i.exports = function(a) {
        var u = n.Symbol || (n.Symbol = {});
        o(u, a) || t(u, a, { value: r.f(a) });
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
        return { write: function(o, r, t, a, u, s) {
          var l = [];
          l.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), n.isString(a) && l.push("path=" + a), n.isString(u) && l.push("domain=" + u), s === !0 && l.push("secure"), document.cookie = l.join("; ");
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
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), a = e("d012"), u = e("1be4"), s = e("cc12"), l = e("f772"), c = ">", f = "<", v = "prototype", p = "script", h = l("IE_PROTO"), m = function() {
      }, g = function(x) {
        return f + p + c + x + f + "/" + p + c;
      }, b = function(x) {
        x.write(g("")), x.close();
        var w = x.parentWindow.Object;
        return x = null, w;
      }, S = function() {
        var x, w = s("iframe"), y = "java" + p + ":";
        return w.style.display = "none", u.appendChild(w), w.src = String(y), x = w.contentWindow.document, x.open(), x.write(g("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? b(n) : S();
        for (var x = t.length; x--; ) delete C[v][t[x]];
        return C();
      };
      a[h] = !0, i.exports = Object.create || function(x, w) {
        var y;
        return x !== null ? (m[v] = o(x), y = new m(), m[v] = null, y[h] = x) : y = C(), w === void 0 ? y : r(y, w);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", a = !0;
      t in [] && Array(1)[t](function() {
        a = !1;
      }), n({ target: "Array", proto: !0, forced: a }, { find: function(u) {
        return o(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), a = e("d44e"), u = e("9112"), s = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), v = e("ae93"), p = v.IteratorPrototype, h = v.BUGGY_SAFARI_ITERATORS, m = l("iterator"), g = "keys", b = "values", S = "entries", C = function() {
        return this;
      };
      i.exports = function(x, w, y, j, E, L, O) {
        o(y, w, j);
        var F, V, J, ae = function(ne) {
          if (ne === E && A) return A;
          if (!h && ne in U) return U[ne];
          switch (ne) {
            case g:
              return function() {
                return new y(this, ne);
              };
            case b:
              return function() {
                return new y(this, ne);
              };
            case S:
              return function() {
                return new y(this, ne);
              };
          }
          return function() {
            return new y(this);
          };
        }, H = w + " Iterator", W = !1, U = x.prototype, T = U[m] || U["@@iterator"] || E && U[E], A = !h && T || ae(E), z = w == "Array" && U.entries || T;
        if (z && (F = r(z.call(new x())), p !== Object.prototype && F.next && (c || r(F) === p || (t ? t(F, p) : typeof F[m] != "function" && u(F, m, C)), a(F, H, !0, !0), c && (f[H] = C))), E == b && T && T.name !== b && (W = !0, A = function() {
          return T.call(this);
        }), c && !O || U[m] === A || u(U, m, A), f[w] = A, E) if (V = { values: ae(b), keys: L ? A : ae(g), entries: ae(S) }, O) for (J in V) (h || W || !(J in U)) && s(U, J, V[J]);
        else n({ target: w, proto: !0, forced: h || W }, V);
        return V;
      };
    }, "7eb5": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
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
      i.exports = function(t, a, u) {
        var s = n(a);
        s in t ? o.f(t, s, r(0, u)) : t[s] = u;
      };
    }, "861d": function(i, d) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, d, e) {
      var n, o, r;
      (function(t, a) {
        o = [], n = a, r = typeof n == "function" ? n.apply(d, o) : n, r === void 0 || (i.exports = r);
      })(typeof self < "u" && self, function() {
        function t() {
          var a = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!a && "currentScript" in document && document.currentScript || a && a.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (S) {
            var u, s, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, v = c.exec(S.stack) || f.exec(S.stack), p = v && v[1] || !1, h = v && v[2] || !1, m = document.location.href.replace(document.location.hash, ""), g = document.getElementsByTagName("script");
            p === m && (u = document.documentElement.outerHTML, s = new RegExp("(?:[^\\n]+?\\n){0," + (h - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = u.replace(s, "$1").trim());
            for (var b = 0; b < g.length; b++)
              if (g[b].readyState === "interactive" || g[b].src === p || p === m && g[b].innerHTML && g[b].innerHTML.trim() === l) return g[b];
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
      i.exports = X;
    }, "8df4": function(i, d, e) {
      var n = e("7a77");
      function o(r) {
        if (typeof r != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(u) {
          t = u;
        });
        var a = this;
        r(function(u) {
          a.reason || (a.reason = new n(u), t(a.reason));
        });
      }
      o.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, o.source = function() {
        var r, t = new o(function(a) {
          r = a;
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
      i.exports = n ? function(t, a, u) {
        return o.f(t, a, r(1, u));
      } : function(t, a, u) {
        return t[a] = u, t;
      };
    }, 9263: function(i, d, e) {
      var n = e("ad6d"), o = e("9f7f"), r = RegExp.prototype.exec, t = String.prototype.replace, a = r, u = function() {
        var f = /a/, v = /b*/g;
        return r.call(f, "a"), r.call(v, "a"), f.lastIndex !== 0 || v.lastIndex !== 0;
      }(), s = o.UNSUPPORTED_Y || o.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, c = u || l || s;
      c && (a = function(f) {
        var v, p, h, m, g = this, b = s && g.sticky, S = n.call(g), C = g.source, x = 0, w = f;
        return b && (S = S.replace("y", ""), S.indexOf("g") === -1 && (S += "g"), w = String(f).slice(g.lastIndex), g.lastIndex > 0 && (!g.multiline || g.multiline && f[g.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", w = " " + w, x++), p = new RegExp("^(?:" + C + ")", S)), l && (p = new RegExp("^" + C + "$(?!\\s)", S)), u && (v = g.lastIndex), h = r.call(b ? p : g, w), b ? h ? (h.input = h.input.slice(x), h[0] = h[0].slice(x), h.index = g.lastIndex, g.lastIndex += h[0].length) : g.lastIndex = 0 : u && h && (g.lastIndex = g.global ? h.index + h[0].length : v), l && h && h.length > 1 && t.call(h[0], p, function() {
          for (m = 1; m < arguments.length - 2; m++) arguments[m] === void 0 && (h[m] = void 0);
        }), h;
      }), i.exports = a;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(l, c) {
        var f = a[t(l)];
        return f == s || f != u && (typeof c == "function" ? n(c) : !!c);
      }, t = r.normalize = function(l) {
        return String(l).replace(o, ".").toLowerCase();
      }, a = r.data = {}, u = r.NATIVE = "N", s = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, a = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", s = t.toStringTag || "@@toStringTag", l = typeof i == "object", c = e.regeneratorRuntime;
        if (c) l && (i.exports = c);
        else {
          c = e.regeneratorRuntime = l ? i.exports : {}, c.wrap = x;
          var f = "suspendedStart", v = "suspendedYield", p = "executing", h = "completed", m = {}, g = {};
          g[a] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, S = b && b(b(W([])));
          S && S !== o && r.call(S, a) && (g = S);
          var C = E.prototype = y.prototype = Object.create(g);
          j.prototype = C.constructor = E, E.constructor = j, E[s] = j.displayName = "GeneratorFunction", c.isGeneratorFunction = function(T) {
            var A = typeof T == "function" && T.constructor;
            return !!A && (A === j || (A.displayName || A.name) === "GeneratorFunction");
          }, c.mark = function(T) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(T, E) : (T.__proto__ = E, s in T || (T[s] = "GeneratorFunction")), T.prototype = Object.create(C), T;
          }, c.awrap = function(T) {
            return { __await: T };
          }, L(O.prototype), O.prototype[u] = function() {
            return this;
          }, c.AsyncIterator = O, c.async = function(T, A, z, ne) {
            var R = new O(x(T, A, z, ne));
            return c.isGeneratorFunction(A) ? R : R.next().then(function(_e) {
              return _e.done ? _e.value : R.next();
            });
          }, L(C), C[s] = "Generator", C[a] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, c.keys = function(T) {
            var A = [];
            for (var z in T) A.push(z);
            return A.reverse(), function ne() {
              for (; A.length; ) {
                var R = A.pop();
                if (R in T) return ne.value = R, ne.done = !1, ne;
              }
              return ne.done = !0, ne;
            };
          }, c.values = W, H.prototype = { constructor: H, reset: function(T) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !T) for (var A in this) A.charAt(0) === "t" && r.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var T = this.tryEntries[0], A = T.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(T) {
            if (this.done) throw T;
            var A = this;
            function z($e, Ue) {
              return _e.type = "throw", _e.arg = T, A.next = $e, Ue && (A.method = "next", A.arg = n), !!Ue;
            }
            for (var ne = this.tryEntries.length - 1; ne >= 0; --ne) {
              var R = this.tryEntries[ne], _e = R.completion;
              if (R.tryLoc === "root") return z("end");
              if (R.tryLoc <= this.prev) {
                var ve = r.call(R, "catchLoc"), Ne = r.call(R, "finallyLoc");
                if (ve && Ne) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                } else if (ve) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                } else {
                  if (!Ne) throw new Error("try statement without catch or finally");
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                }
              }
            }
          }, abrupt: function(T, A) {
            for (var z = this.tryEntries.length - 1; z >= 0; --z) {
              var ne = this.tryEntries[z];
              if (ne.tryLoc <= this.prev && r.call(ne, "finallyLoc") && this.prev < ne.finallyLoc) {
                var R = ne;
                break;
              }
            }
            R && (T === "break" || T === "continue") && R.tryLoc <= A && A <= R.finallyLoc && (R = null);
            var _e = R ? R.completion : {};
            return _e.type = T, _e.arg = A, R ? (this.method = "next", this.next = R.finallyLoc, m) : this.complete(_e);
          }, complete: function(T, A) {
            if (T.type === "throw") throw T.arg;
            return T.type === "break" || T.type === "continue" ? this.next = T.arg : T.type === "return" ? (this.rval = this.arg = T.arg, this.method = "return", this.next = "end") : T.type === "normal" && A && (this.next = A), m;
          }, finish: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.finallyLoc === T) return this.complete(z.completion, z.afterLoc), ae(z), m;
            }
          }, catch: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.tryLoc === T) {
                var ne = z.completion;
                if (ne.type === "throw") {
                  var R = ne.arg;
                  ae(z);
                }
                return R;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(T, A, z) {
            return this.delegate = { iterator: W(T), resultName: A, nextLoc: z }, this.method === "next" && (this.arg = n), m;
          } };
        }
        function x(T, A, z, ne) {
          var R = A && A.prototype instanceof y ? A : y, _e = Object.create(R.prototype), ve = new H(ne || []);
          return _e._invoke = F(T, z, ve), _e;
        }
        function w(T, A, z) {
          try {
            return { type: "normal", arg: T.call(A, z) };
          } catch (ne) {
            return { type: "throw", arg: ne };
          }
        }
        function y() {
        }
        function j() {
        }
        function E() {
        }
        function L(T) {
          ["next", "throw", "return"].forEach(function(A) {
            T[A] = function(z) {
              return this._invoke(A, z);
            };
          });
        }
        function O(T) {
          function A(R, _e, ve, Ne) {
            var $e = w(T[R], T, _e);
            if ($e.type !== "throw") {
              var Ue = $e.arg, Ae = Ue.value;
              return Ae && typeof Ae == "object" && r.call(Ae, "__await") ? Promise.resolve(Ae.__await).then(function(Pe) {
                A("next", Pe, ve, Ne);
              }, function(Pe) {
                A("throw", Pe, ve, Ne);
              }) : Promise.resolve(Ae).then(function(Pe) {
                Ue.value = Pe, ve(Ue);
              }, Ne);
            }
            Ne($e.arg);
          }
          var z;
          function ne(R, _e) {
            function ve() {
              return new Promise(function(Ne, $e) {
                A(R, _e, Ne, $e);
              });
            }
            return z = z ? z.then(ve, ve) : ve();
          }
          this._invoke = ne;
        }
        function F(T, A, z) {
          var ne = f;
          return function(R, _e) {
            if (ne === p) throw new Error("Generator is already running");
            if (ne === h) {
              if (R === "throw") throw _e;
              return U();
            }
            for (z.method = R, z.arg = _e; ; ) {
              var ve = z.delegate;
              if (ve) {
                var Ne = V(ve, z);
                if (Ne) {
                  if (Ne === m) continue;
                  return Ne;
                }
              }
              if (z.method === "next") z.sent = z._sent = z.arg;
              else if (z.method === "throw") {
                if (ne === f) throw ne = h, z.arg;
                z.dispatchException(z.arg);
              } else z.method === "return" && z.abrupt("return", z.arg);
              ne = p;
              var $e = w(T, A, z);
              if ($e.type === "normal") {
                if (ne = z.done ? h : v, $e.arg === m) continue;
                return { value: $e.arg, done: z.done };
              }
              $e.type === "throw" && (ne = h, z.method = "throw", z.arg = $e.arg);
            }
          };
        }
        function V(T, A) {
          var z = T.iterator[A.method];
          if (z === n) {
            if (A.delegate = null, A.method === "throw") {
              if (T.iterator.return && (A.method = "return", A.arg = n, V(T, A), A.method === "throw")) return m;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return m;
          }
          var ne = w(z, T.iterator, A.arg);
          if (ne.type === "throw") return A.method = "throw", A.arg = ne.arg, A.delegate = null, m;
          var R = ne.arg;
          return R ? R.done ? (A[T.resultName] = R.value, A.next = T.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, m) : R : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, m);
        }
        function J(T) {
          var A = { tryLoc: T[0] };
          1 in T && (A.catchLoc = T[1]), 2 in T && (A.finallyLoc = T[2], A.afterLoc = T[3]), this.tryEntries.push(A);
        }
        function ae(T) {
          var A = T.completion || {};
          A.type = "normal", delete A.arg, T.completion = A;
        }
        function H(T) {
          this.tryEntries = [{ tryLoc: "root" }], T.forEach(J, this), this.reset(!0);
        }
        function W(T) {
          if (T) {
            var A = T[a];
            if (A) return A.call(T);
            if (typeof T.next == "function") return T;
            if (!isNaN(T.length)) {
              var z = -1, ne = function R() {
                for (; ++z < T.length; ) if (r.call(T, z)) return R.value = T[z], R.done = !1, R;
                return R.value = n, R.done = !0, R;
              };
              return ne.next = ne;
            }
          }
          return { next: U };
        }
        function U() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), a = e("7b0b"), u = e("50c4"), s = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), v = e("2d00"), p = f("isConcatSpreadable"), h = 9007199254740991, m = "Maximum allowed index exceeded", g = v >= 51 || !o(function() {
        var x = [];
        return x[p] = !1, x.concat()[0] !== x;
      }), b = c("concat"), S = function(x) {
        if (!t(x)) return !1;
        var w = x[p];
        return w !== void 0 ? !!w : r(x);
      }, C = !g || !b;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var w, y, j, E, L, O = a(this), F = l(O, 0), V = 0;
        for (w = -1, j = arguments.length; w < j; w++) if (L = w === -1 ? O : arguments[w], S(L)) {
          if (E = u(L.length), V + E > h) throw TypeError(m);
          for (y = 0; y < E; y++, V++) y in L && s(F, V, L[y]);
        } else {
          if (V >= h) throw TypeError(m);
          s(F, V++, L);
        }
        return F.length = V, F;
      } });
    }, "9aaf": function(i, d, e) {
      e("70d3");
    }, "9bdd": function(i, d, e) {
      var n = e("825a"), o = e("2a62");
      i.exports = function(r, t, a, u) {
        try {
          return u ? t(n(a)[0], a[1]) : t(a);
        } catch (s) {
          throw o(r), s;
        }
      };
    }, "9bf2": function(i, d, e) {
      var n = e("83ab"), o = e("0cfb"), r = e("825a"), t = e("c04e"), a = Object.defineProperty;
      d.f = n ? a : function(u, s, l) {
        if (r(u), s = t(s, !0), r(l), o) try {
          return a(u, s, l);
        } catch {
        }
        if ("get" in l || "set" in l) throw TypeError("Accessors not supported");
        return "value" in l && (u[s] = l.value), u;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), a = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(s, l, c) {
        var f = l + " Iterator";
        return s.prototype = o(n, { next: r(1, c) }), t(s, f, !1, !0), a[f] = u, s;
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
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), a = e("7b0b"), u = e("65f0"), s = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, v = Math.min, p = 9007199254740991, h = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(m, g) {
        var b, S, C, x, w, y, j = a(this), E = t(j.length), L = o(m, E), O = arguments.length;
        if (O === 0 ? b = S = 0 : O === 1 ? (b = 0, S = E - L) : (b = O - 2, S = v(f(r(g), 0), E - L)), E + b - S > p) throw TypeError(h);
        for (C = u(j, S), x = 0; x < S; x++) w = L + x, w in j && s(C, x, j[w]);
        if (C.length = S, b < S) {
          for (x = L; x < E - S; x++) w = x + S, y = x + b, w in j ? j[y] = j[w] : delete j[y];
          for (x = E; x > E - S + b; x--) delete j[x - 1];
        } else if (b > S) for (x = E - S; x > L; x--) w = x + S - 1, y = x + b - 1, w in j ? j[y] = j[w] : delete j[y];
        for (x = 0; x < b; x++) j[x + L] = arguments[x + 2];
        return j.length = E - S + b, C;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), a = e("83ab"), u = e("4930"), s = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), v = e("861d"), p = e("825a"), h = e("7b0b"), m = e("fc6a"), g = e("c04e"), b = e("5c6c"), S = e("7c73"), C = e("df75"), x = e("241c"), w = e("057f"), y = e("7418"), j = e("06cf"), E = e("9bf2"), L = e("d1e7"), O = e("9112"), F = e("6eeb"), V = e("5692"), J = e("f772"), ae = e("d012"), H = e("90e3"), W = e("b622"), U = e("e538"), T = e("746f"), A = e("d44e"), z = e("69f3"), ne = e("b727").forEach, R = J("hidden"), _e = "Symbol", ve = "prototype", Ne = W("toPrimitive"), $e = z.set, Ue = z.getterFor(_e), Ae = Object[ve], Pe = o.Symbol, He = r("JSON", "stringify"), et = j.f, $ = E.f, B = w.f, Z = L.f, D = V("symbols"), ee = V("op-symbols"), ie = V("string-to-symbol-registry"), be = V("symbol-to-string-registry"), ge = V("wks"), ce = o.QObject, Se = !ce || !ce[ve] || !ce[ve].findChild, Ee = a && l(function() {
        return S($({}, "a", { get: function() {
          return $(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, le) {
        var me = et(Ae, oe);
        me && delete Ae[oe], $(q, oe, le), me && q !== Ae && $(Ae, oe, me);
      } : $, De = function(q, oe) {
        var le = D[q] = S(Pe[ve]);
        return $e(le, { type: _e, tag: q, description: oe }), a || (le.description = oe), le;
      }, re = s ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Pe;
      }, M = function(q, oe, le) {
        q === Ae && M(ee, oe, le), p(q);
        var me = g(oe, !0);
        return p(le), c(D, me) ? (le.enumerable ? (c(q, R) && q[R][me] && (q[R][me] = !1), le = S(le, { enumerable: b(0, !1) })) : (c(q, R) || $(q, R, b(1, {})), q[R][me] = !0), Ee(q, me, le)) : $(q, me, le);
      }, G = function(q, oe) {
        p(q);
        var le = m(oe), me = C(le).concat(fe(le));
        return ne(me, function(We) {
          a && !dt.call(le, We) || M(q, We, le[We]);
        }), q;
      }, Ke = function(q, oe) {
        return oe === void 0 ? S(q) : G(S(q), oe);
      }, dt = function(q) {
        var oe = g(q, !0), le = Z.call(this, oe);
        return !(this === Ae && c(D, oe) && !c(ee, oe)) && (!(le || !c(this, oe) || !c(D, oe) || c(this, R) && this[R][oe]) || le);
      }, K = function(q, oe) {
        var le = m(q), me = g(oe, !0);
        if (le !== Ae || !c(D, me) || c(ee, me)) {
          var We = et(le, me);
          return !We || !c(D, me) || c(le, R) && le[R][me] || (We.enumerable = !0), We;
        }
      }, se = function(q) {
        var oe = B(m(q)), le = [];
        return ne(oe, function(me) {
          c(D, me) || c(ae, me) || le.push(me);
        }), le;
      }, fe = function(q) {
        var oe = q === Ae, le = B(oe ? ee : m(q)), me = [];
        return ne(le, function(We) {
          !c(D, We) || oe && !c(Ae, We) || me.push(D[We]);
        }), me;
      };
      if (u || (Pe = function() {
        if (this instanceof Pe) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = H(q), le = function(me) {
          this === Ae && le.call(ee, me), c(this, R) && c(this[R], oe) && (this[R][oe] = !1), Ee(this, oe, b(1, me));
        };
        return a && Se && Ee(Ae, oe, { configurable: !0, set: le }), De(oe, q);
      }, F(Pe[ve], "toString", function() {
        return Ue(this).tag;
      }), F(Pe, "withoutSetter", function(q) {
        return De(H(q), q);
      }), L.f = dt, E.f = M, j.f = K, x.f = w.f = se, y.f = fe, U.f = function(q) {
        return De(W(q), q);
      }, a && ($(Pe[ve], "description", { configurable: !0, get: function() {
        return Ue(this).description;
      } }), t || F(Ae, "propertyIsEnumerable", dt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Pe }), ne(C(ge), function(q) {
        T(q);
      }), n({ target: _e, stat: !0, forced: !u }, { for: function(q) {
        var oe = String(q);
        if (c(ie, oe)) return ie[oe];
        var le = Pe(oe);
        return ie[oe] = le, be[le] = oe, le;
      }, keyFor: function(q) {
        if (!re(q)) throw TypeError(q + " is not a symbol");
        if (c(be, q)) return be[q];
      }, useSetter: function() {
        Se = !0;
      }, useSimple: function() {
        Se = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !a }, { create: Ke, defineProperty: M, defineProperties: G, getOwnPropertyDescriptor: K }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: se, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: l(function() {
        y.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return y.f(h(q));
      } }), He) {
        var he = !u || l(function() {
          var q = Pe();
          return He([q]) != "[null]" || He({ a: q }) != "{}" || He(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: he }, { stringify: function(q, oe, le) {
          for (var me, We = [q], Ye = 1; arguments.length > Ye; ) We.push(arguments[Ye++]);
          if (me = oe, (v(oe) || q !== void 0) && !re(q)) return f(oe) || (oe = function(at, je) {
            if (typeof me == "function" && (je = me.call(this, at, je)), !re(je)) return je;
          }), We[1] = oe, He.apply(null, We);
        } });
      }
      Pe[ve][Ne] || O(Pe[ve], Ne, Pe[ve].valueOf), A(Pe, _e), ae[R] = !0;
    }, a630: function(i, d, e) {
      var n = e("23e7"), o = e("4df4"), r = e("1c7e"), t = !r(function(a) {
        Array.from(a);
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
      var n, o, r, t = e("d039"), a = e("e163"), u = e("9112"), s = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), v = !1, p = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = a(a(r)), o !== Object.prototype && (n = o)) : v = !0);
      var h = n == null || t(function() {
        var m = {};
        return n[f].call(m) !== m;
      });
      h && (n = {}), c && !h || s(n, f) || u(n, f, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: v };
    }, b041: function(i, d, e) {
      var n = e("00ee"), o = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + o(this) + "]";
      };
    }, b0c0: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2").f, r = Function.prototype, t = r.toString, a = /^\s*function ([^ (]*)/, u = "name";
      n && !(u in r) && o(r, u, { configurable: !0, get: function() {
        try {
          return t.call(this).match(a)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, d, e) {
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), a = e("83b9"), u = e("c345"), s = e("3934"), l = e("2d83");
      i.exports = function(c) {
        return new Promise(function(f, v) {
          var p = c.data, h = c.headers;
          n.isFormData(p) && delete h["Content-Type"];
          var m = new XMLHttpRequest();
          if (c.auth) {
            var g = c.auth.username || "", b = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            h.Authorization = "Basic " + btoa(g + ":" + b);
          }
          var S = a(c.baseURL, c.url);
          if (m.open(c.method.toUpperCase(), t(S, c.params, c.paramsSerializer), !0), m.timeout = c.timeout, m.onreadystatechange = function() {
            if (m && m.readyState === 4 && (m.status !== 0 || m.responseURL && m.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in m ? u(m.getAllResponseHeaders()) : null, w = c.responseType && c.responseType !== "text" ? m.response : m.responseText, y = { data: w, status: m.status, statusText: m.statusText, headers: x, config: c, request: m };
              o(f, v, y), m = null;
            }
          }, m.onabort = function() {
            m && (v(l("Request aborted", c, "ECONNABORTED", m)), m = null);
          }, m.onerror = function() {
            v(l("Network Error", c, null, m)), m = null;
          }, m.ontimeout = function() {
            var x = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (x = c.timeoutErrorMessage), v(l(x, c, "ECONNABORTED", m)), m = null;
          }, n.isStandardBrowserEnv()) {
            var C = (c.withCredentials || s(S)) && c.xsrfCookieName ? r.read(c.xsrfCookieName) : void 0;
            C && (h[c.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in m && n.forEach(h, function(x, w) {
            typeof p > "u" && w.toLowerCase() === "content-type" ? delete h[w] : m.setRequestHeader(w, x);
          }), n.isUndefined(c.withCredentials) || (m.withCredentials = !!c.withCredentials), c.responseType) try {
            m.responseType = c.responseType;
          } catch (x) {
            if (c.responseType !== "json") throw x;
          }
          typeof c.onDownloadProgress == "function" && m.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && m.upload && m.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(x) {
            m && (m.abort(), v(x), m = null);
          }), p || (p = null), m.send(p);
        });
      };
    }, b575: function(i, d, e) {
      var n, o, r, t, a, u, s, l, c = e("da84"), f = e("06cf").f, v = e("2cf4").set, p = e("1cdc"), h = e("a4b4"), m = e("605d"), g = c.MutationObserver || c.WebKitMutationObserver, b = c.document, S = c.process, C = c.Promise, x = f(c, "queueMicrotask"), w = x && x.value;
      w || (n = function() {
        var y, j;
        for (m && (y = S.domain) && y.exit(); o; ) {
          j = o.fn, o = o.next;
          try {
            j();
          } catch (E) {
            throw o ? t() : r = void 0, E;
          }
        }
        r = void 0, y && y.enter();
      }, p || m || h || !g || !b ? C && C.resolve ? (s = C.resolve(void 0), l = s.then, t = function() {
        l.call(s, n);
      }) : t = m ? function() {
        S.nextTick(n);
      } : function() {
        v.call(c, n);
      } : (a = !0, u = b.createTextNode(""), new g(n).observe(u, { characterData: !0 }), t = function() {
        u.data = a = !a;
      })), i.exports = w || function(y) {
        var j = { fn: y, next: void 0 };
        r && (r.next = j), o || (o = j, t()), r = j;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), a = e("4930"), u = e("fdbf"), s = o("wks"), l = n.Symbol, c = u ? l : l && l.withoutSetter || t;
      i.exports = function(f) {
        return r(s, f) && (a || typeof s[f] == "string") || (a && r(l, f) ? s[f] = l[f] : s[f] = c("Symbol." + f)), s[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), a = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: a }, { keys: function(u) {
        return r(o(u));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), a = e("d039"), u = 1 .toFixed, s = Math.floor, l = function(m, g, b) {
        return g === 0 ? b : g % 2 === 1 ? l(m, g - 1, b * m) : l(m * m, g / 2, b);
      }, c = function(m) {
        for (var g = 0, b = m; b >= 4096; ) g += 12, b /= 4096;
        for (; b >= 2; ) g += 1, b /= 2;
        return g;
      }, f = function(m, g, b) {
        for (var S = -1, C = b; ++S < 6; ) C += g * m[S], m[S] = C % 1e7, C = s(C / 1e7);
      }, v = function(m, g) {
        for (var b = 6, S = 0; --b >= 0; ) S += m[b], m[b] = s(S / g), S = S % g * 1e7;
      }, p = function(m) {
        for (var g = 6, b = ""; --g >= 0; ) if (b !== "" || g === 0 || m[g] !== 0) {
          var S = String(m[g]);
          b = b === "" ? S : b + t.call("0", 7 - S.length) + S;
        }
        return b;
      }, h = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !a(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: h }, { toFixed: function(m) {
        var g, b, S, C, x = r(this), w = o(m), y = [0, 0, 0, 0, 0, 0], j = "", E = "0";
        if (w < 0 || w > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (j = "-", x = -x), x > 1e-21) if (g = c(x * l(2, 69, 1)) - 69, b = g < 0 ? x * l(2, -g, 1) : x / l(2, g, 1), b *= 4503599627370496, g = 52 - g, g > 0) {
          for (f(y, 0, b), S = w; S >= 7; ) f(y, 1e7, 0), S -= 7;
          for (f(y, l(10, S, 1), 0), S = g - 1; S >= 23; ) v(y, 1 << 23), S -= 23;
          v(y, 1 << S), f(y, 1, 1), v(y, 2), E = p(y);
        } else f(y, 0, b), f(y, 1 << -g, 0), E = p(y) + t.call("0", w);
        return w > 0 ? (C = E.length, E = j + (C <= w ? "0." + t.call("0", w - C) + E : E.slice(0, C - w) + "." + E.slice(C - w))) : E = j + E, E;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), a = e("65f0"), u = [].push, s = function(l) {
        var c = l == 1, f = l == 2, v = l == 3, p = l == 4, h = l == 6, m = l == 7, g = l == 5 || h;
        return function(b, S, C, x) {
          for (var w, y, j = r(b), E = o(j), L = n(S, C, 3), O = t(E.length), F = 0, V = x || a, J = c ? V(b, O) : f || m ? V(b, 0) : void 0; O > F; F++) if ((g || F in E) && (w = E[F], y = L(w, F, j), l)) if (c) J[F] = y;
          else if (y) switch (l) {
            case 3:
              return !0;
            case 5:
              return w;
            case 6:
              return F;
            case 2:
              u.call(J, w);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              u.call(J, w);
          }
          return h ? -1 : v || p ? p : J;
        };
      };
      i.exports = { forEach: s(0), map: s(1), filter: s(2), some: s(3), every: s(4), find: s(5), findIndex: s(6), filterOut: s(7) };
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
        var t, a;
        if (r && typeof (t = o.toString) == "function" && !n(a = t.call(o)) || typeof (t = o.valueOf) == "function" && !n(a = t.call(o)) || !r && typeof (t = o.toString) == "function" && !n(a = t.call(o))) return a;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, d, e) {
      var n = e("c532"), o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(r) {
        var t, a, u, s = {};
        return r && n.forEach(r.split(`
`), function(l) {
          if (u = l.indexOf(":"), t = n.trim(l.substr(0, u)).toLowerCase(), a = n.trim(l.substr(u + 1)), t) {
            if (s[t] && o.indexOf(t) >= 0) return;
            s[t] = t === "set-cookie" ? (s[t] ? s[t] : []).concat([a]) : s[t] ? s[t] + ", " + a : a;
          }
        }), s;
      };
    }, c401: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r, t) {
        return n.forEach(t, function(a) {
          o = a(o, r);
        }), o;
      };
    }, c430: function(i, d) {
      i.exports = !1;
    }, c532: function(i, d, e) {
      var n = e("1d2b"), o = Object.prototype.toString;
      function r(O) {
        return o.call(O) === "[object Array]";
      }
      function t(O) {
        return typeof O > "u";
      }
      function a(O) {
        return O !== null && !t(O) && O.constructor !== null && !t(O.constructor) && typeof O.constructor.isBuffer == "function" && O.constructor.isBuffer(O);
      }
      function u(O) {
        return o.call(O) === "[object ArrayBuffer]";
      }
      function s(O) {
        return typeof FormData < "u" && O instanceof FormData;
      }
      function l(O) {
        var F;
        return F = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(O) : O && O.buffer && O.buffer instanceof ArrayBuffer, F;
      }
      function c(O) {
        return typeof O == "string";
      }
      function f(O) {
        return typeof O == "number";
      }
      function v(O) {
        return O !== null && typeof O == "object";
      }
      function p(O) {
        if (o.call(O) !== "[object Object]") return !1;
        var F = Object.getPrototypeOf(O);
        return F === null || F === Object.prototype;
      }
      function h(O) {
        return o.call(O) === "[object Date]";
      }
      function m(O) {
        return o.call(O) === "[object File]";
      }
      function g(O) {
        return o.call(O) === "[object Blob]";
      }
      function b(O) {
        return o.call(O) === "[object Function]";
      }
      function S(O) {
        return v(O) && b(O.pipe);
      }
      function C(O) {
        return typeof URLSearchParams < "u" && O instanceof URLSearchParams;
      }
      function x(O) {
        return O.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function w() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function y(O, F) {
        if (O !== null && typeof O < "u") if (typeof O != "object" && (O = [O]), r(O)) for (var V = 0, J = O.length; V < J; V++) F.call(null, O[V], V, O);
        else for (var ae in O) Object.prototype.hasOwnProperty.call(O, ae) && F.call(null, O[ae], ae, O);
      }
      function j() {
        var O = {};
        function F(ae, H) {
          p(O[H]) && p(ae) ? O[H] = j(O[H], ae) : p(ae) ? O[H] = j({}, ae) : r(ae) ? O[H] = ae.slice() : O[H] = ae;
        }
        for (var V = 0, J = arguments.length; V < J; V++) y(arguments[V], F);
        return O;
      }
      function E(O, F, V) {
        return y(F, function(J, ae) {
          O[ae] = V && typeof J == "function" ? n(J, V) : J;
        }), O;
      }
      function L(O) {
        return O.charCodeAt(0) === 65279 && (O = O.slice(1)), O;
      }
      i.exports = { isArray: r, isArrayBuffer: u, isBuffer: a, isFormData: s, isArrayBufferView: l, isString: c, isNumber: f, isObject: v, isPlainObject: p, isUndefined: t, isDate: h, isFile: m, isBlob: g, isFunction: b, isStream: S, isURLSearchParams: C, isStandardBrowserEnv: w, forEach: y, merge: j, extend: E, trim: x, stripBOM: L };
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
        n.forEach(o, function(t, a) {
          a !== r && a.toUpperCase() === r.toUpperCase() && (o[r] = t, delete o[a]);
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
      i.exports = function(a, u) {
        var s, l = o(a), c = 0, f = [];
        for (s in l) !n(t, s) && n(l, s) && f.push(s);
        for (; u.length > c; ) n(l, s = u[c++]) && (~r(f, s) || f.push(s));
        return f;
      };
    }, caad: function(i, d, e) {
      var n = e("23e7"), o = e("4d64").includes, r = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), r("includes");
    }, cc12: function(i, d, e) {
      var n = e("da84"), o = e("861d"), r = n.document, t = o(r) && o(r.createElement);
      i.exports = function(a) {
        return t ? r.createElement(a) : {};
      };
    }, cdf9: function(i, d, e) {
      var n = e("825a"), o = e("861d"), r = e("f069");
      i.exports = function(t, a) {
        if (n(t), o(a) && a.constructor === t) return a;
        var u = r.f(t), s = u.resolve;
        return s(a), u.promise;
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
      var n = e("c532"), o = e("1d2b"), r = e("0a06"), t = e("4a7b"), a = e("2444");
      function u(l) {
        var c = new r(l), f = o(r.prototype.request, c);
        return n.extend(f, r.prototype, c), n.extend(f, c), f;
      }
      var s = u(a);
      s.Axios = r, s.create = function(l) {
        return u(t(s.defaults, l));
      }, s.Cancel = e("7a77"), s.CancelToken = e("8df4"), s.isCancel = e("2e67"), s.all = function(l) {
        return Promise.all(l);
      }, s.spread = e("0df6"), s.isAxiosError = e("5f02"), i.exports = s, i.exports.default = s;
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
      i.exports = function(t, a) {
        return arguments.length < 2 ? r(n[t]) || r(o[t]) : n[t] && n[t][a] || o[t] && o[t][a];
      };
    }, d1e7: function(i, d, e) {
      var n = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, r = o && !n.call({ 1: 2 }, 1);
      d.f = r ? function(t) {
        var a = o(this, t);
        return !!a && a.enumerable;
      } : n;
    }, d28b: function(i, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, d, e) {
      var n = e("825a"), o = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var r, t = !1, a = {};
        try {
          r = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, r.call(a, []), t = a instanceof Array;
        } catch {
        }
        return function(u, s) {
          return n(u), o(s), t ? r.call(u, s) : u.__proto__ = s, u;
        };
      }() : void 0);
    }, d3b7: function(i, d, e) {
      var n = e("00ee"), o = e("6eeb"), r = e("b041");
      n || o(Object.prototype, "toString", r, { unsafe: !0 });
    }, d40d: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
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
      t.a.add(a), d.default = a;
    }, d44e: function(i, d, e) {
      var n = e("9bf2").f, o = e("5135"), r = e("b622"), t = r("toStringTag");
      i.exports = function(a, u, s) {
        a && !o(a = s ? a : a.prototype, t) && n(a, t, { configurable: !0, value: u });
      };
    }, d58f: function(i, d, e) {
      var n = e("1c0b"), o = e("7b0b"), r = e("44ad"), t = e("50c4"), a = function(u) {
        return function(s, l, c, f) {
          n(l);
          var v = o(s), p = r(v), h = t(v.length), m = u ? h - 1 : 0, g = u ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (m in p) {
              f = p[m], m += g;
              break;
            }
            if (m += g, u ? m < 0 : h <= m) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? m >= 0 : h > m; m += g) m in p && (f = l(f, p[m], m, v));
          return f;
        };
      };
      i.exports = { left: a(!1), right: a(!0) };
    }, d69c: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, d784: function(i, d, e) {
      e("ac1f");
      var n = e("6eeb"), o = e("d039"), r = e("b622"), t = e("9263"), a = e("9112"), u = r("species"), s = !o(function() {
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
      i.exports = function(p, h, m, g) {
        var b = r(p), S = !o(function() {
          var E = {};
          return E[b] = function() {
            return 7;
          }, ""[p](E) != 7;
        }), C = S && !o(function() {
          var E = !1, L = /a/;
          return p === "split" && (L = {}, L.constructor = {}, L.constructor[u] = function() {
            return L;
          }, L.flags = "", L[b] = /./[b]), L.exec = function() {
            return E = !0, null;
          }, L[b](""), !E;
        });
        if (!S || !C || p === "replace" && (!s || !l || f) || p === "split" && !v) {
          var x = /./[b], w = m(b, ""[p], function(E, L, O, F, V) {
            return L.exec === t ? S && !V ? { done: !0, value: x.call(L, O, F) } : { done: !0, value: E.call(O, L, F) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), y = w[0], j = w[1];
          n(String.prototype, p, y), n(RegExp.prototype, b, h == 2 ? function(E, L) {
            return j.call(E, this, L);
          } : function(E) {
            return j.call(E, this);
          });
        }
        g && a(RegExp.prototype[b], "sham", !0);
      };
    }, d81d: function(i, d, e) {
      var n = e("23e7"), o = e("b727").map, r = e("1dde"), t = r("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(a) {
        return o(this, a, arguments.length > 1 ? arguments[1] : void 0);
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
      var n = e("23e7"), o = e("83ab"), r = e("56ef"), t = e("fc6a"), a = e("06cf"), u = e("8418");
      n({ target: "Object", stat: !0, sham: !o }, { getOwnPropertyDescriptors: function(s) {
        for (var l, c, f = t(s), v = a.f, p = r(f), h = {}, m = 0; p.length > m; ) c = v(f, l = p[m++]), c !== void 0 && u(h, l, c);
        return h;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), a = e("b622"), u = a("iterator"), s = a("toStringTag"), l = r.values;
      for (var c in o) {
        var f = n[c], v = f && f.prototype;
        if (v) {
          if (v[u] !== l) try {
            t(v, u, l);
          } catch {
            v[u] = l;
          }
          if (v[s] || t(v, s, c), o[c]) {
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
        function o(u, s) {
          for (var l = 0, c = u.length - 1; c >= 0; c--) {
            var f = u[c];
            f === "." ? u.splice(c, 1) : f === ".." ? (u.splice(c, 1), l++) : l && (u.splice(c, 1), l--);
          }
          if (s) for (; l--; l) u.unshift("..");
          return u;
        }
        function r(u) {
          typeof u != "string" && (u += "");
          var s, l = 0, c = -1, f = !0;
          for (s = u.length - 1; s >= 0; --s) if (u.charCodeAt(s) === 47) {
            if (!f) {
              l = s + 1;
              break;
            }
          } else c === -1 && (f = !1, c = s + 1);
          return c === -1 ? "" : u.slice(l, c);
        }
        function t(u, s) {
          if (u.filter) return u.filter(s);
          for (var l = [], c = 0; c < u.length; c++) s(u[c], c, u) && l.push(u[c]);
          return l;
        }
        d.resolve = function() {
          for (var u = "", s = !1, l = arguments.length - 1; l >= -1 && !s; l--) {
            var c = l >= 0 ? arguments[l] : n.cwd();
            if (typeof c != "string") throw new TypeError("Arguments to path.resolve must be strings");
            c && (u = c + "/" + u, s = c.charAt(0) === "/");
          }
          return u = o(t(u.split("/"), function(f) {
            return !!f;
          }), !s).join("/"), (s ? "/" : "") + u || ".";
        }, d.normalize = function(u) {
          var s = d.isAbsolute(u), l = a(u, -1) === "/";
          return u = o(t(u.split("/"), function(c) {
            return !!c;
          }), !s).join("/"), u || s || (u = "."), u && l && (u += "/"), (s ? "/" : "") + u;
        }, d.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, d.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(u, function(s, l) {
            if (typeof s != "string") throw new TypeError("Arguments to path.join must be strings");
            return s;
          }).join("/"));
        }, d.relative = function(u, s) {
          function l(g) {
            for (var b = 0; b < g.length && g[b] === ""; b++) ;
            for (var S = g.length - 1; S >= 0 && g[S] === ""; S--) ;
            return b > S ? [] : g.slice(b, S - b + 1);
          }
          u = d.resolve(u).substr(1), s = d.resolve(s).substr(1);
          for (var c = l(u.split("/")), f = l(s.split("/")), v = Math.min(c.length, f.length), p = v, h = 0; h < v; h++) if (c[h] !== f[h]) {
            p = h;
            break;
          }
          var m = [];
          for (h = p; h < c.length; h++) m.push("..");
          return m = m.concat(f.slice(p)), m.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var s = u.charCodeAt(0), l = s === 47, c = -1, f = !0, v = u.length - 1; v >= 1; --v) if (s = u.charCodeAt(v), s === 47) {
            if (!f) {
              c = v;
              break;
            }
          } else f = !1;
          return c === -1 ? l ? "/" : "." : l && c === 1 ? "/" : u.slice(0, c);
        }, d.basename = function(u, s) {
          var l = r(u);
          return s && l.substr(-1 * s.length) === s && (l = l.substr(0, l.length - s.length)), l;
        }, d.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var s = -1, l = 0, c = -1, f = !0, v = 0, p = u.length - 1; p >= 0; --p) {
            var h = u.charCodeAt(p);
            if (h !== 47) c === -1 && (f = !1, c = p + 1), h === 46 ? s === -1 ? s = p : v !== 1 && (v = 1) : s !== -1 && (v = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return s === -1 || c === -1 || v === 0 || v === 1 && s === c - 1 && s === l + 1 ? "" : u.slice(s, c);
        };
        var a = "ab".substr(-1) === "b" ? function(u, s, l) {
          return u.substr(s, l);
        } : function(u, s, l) {
          return s < 0 && (s = u.length + s), u.substr(s, l);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(h) {
            var m = h.id, g = h.viewBox, b = h.content;
            this.id = m, this.viewBox = g, this.content = b;
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
            var m = !!document.importNode, g = new DOMParser().parseFromString(h, "image/svg+xml").documentElement;
            return m ? document.importNode(g, !0) : g;
          };
          function t(h, m) {
            return m = { exports: {} }, h(m, m.exports), m.exports;
          }
          var a = t(function(h, m) {
            (function(g, b) {
              h.exports = b();
            })(0, function() {
              function g(y) {
                var j = y && typeof y == "object";
                return j && Object.prototype.toString.call(y) !== "[object RegExp]" && Object.prototype.toString.call(y) !== "[object Date]";
              }
              function b(y) {
                return Array.isArray(y) ? [] : {};
              }
              function S(y, j) {
                var E = j && j.clone === !0;
                return E && g(y) ? w(b(y), y, j) : y;
              }
              function C(y, j, E) {
                var L = y.slice();
                return j.forEach(function(O, F) {
                  typeof L[F] > "u" ? L[F] = S(O, E) : g(O) ? L[F] = w(y[F], O, E) : y.indexOf(O) === -1 && L.push(S(O, E));
                }), L;
              }
              function x(y, j, E) {
                var L = {};
                return g(y) && Object.keys(y).forEach(function(O) {
                  L[O] = S(y[O], E);
                }), Object.keys(j).forEach(function(O) {
                  g(j[O]) && y[O] ? L[O] = w(y[O], j[O], E) : L[O] = S(j[O], E);
                }), L;
              }
              function w(y, j, E) {
                var L = Array.isArray(j), O = E || { arrayMerge: C }, F = O.arrayMerge || C;
                return L ? Array.isArray(y) ? F(y, j, E) : S(j, E) : x(y, j, E);
              }
              return w.all = function(y, j) {
                if (!Array.isArray(y) || y.length < 2) throw new Error("first argument should be an array with at least two elements");
                return y.reduce(function(E, L) {
                  return w(E, L, j);
                });
              }, w;
            });
          }), u = t(function(h, m) {
            var g = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            m.default = g, h.exports = m.default;
          }), s = function(h) {
            return Object.keys(h).map(function(m) {
              var g = h[m].toString().replace(/"/g, "&quot;");
              return m + '="' + g + '"';
            }).join(" ");
          }, l = u.svg, c = u.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var v = function(h, m) {
            h === void 0 && (h = "");
            var g = a(f, {}), b = s(g);
            return "<svg " + b + ">" + h + "</svg>";
          }, p = function(h) {
            function m() {
              h.apply(this, arguments);
            }
            h && (m.__proto__ = h), m.prototype = Object.create(h && h.prototype), m.prototype.constructor = m;
            var g = { isMounted: {} };
            return g.isMounted.get = function() {
              return !!this.node;
            }, m.createFromExistingNode = function(b) {
              return new m({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, m.prototype.destroy = function() {
              this.isMounted && this.unmount(), h.prototype.destroy.call(this);
            }, m.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var S = typeof b == "string" ? document.querySelector(b) : b, C = this.render();
              return this.node = C, S.appendChild(C), C;
            }, m.prototype.render = function() {
              var b = this.stringify();
              return r(v(b)).childNodes[0];
            }, m.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(m.prototype, g), m;
          }(o);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), a = e("861d"), u = e("9bf2").f, s = e("e893"), l = r.Symbol;
      if (o && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var g = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof f ? new l(g) : g === void 0 ? l() : l(g);
          return g === "" && (c[b] = !0), b;
        };
        s(f, l);
        var v = f.prototype = l.prototype;
        v.constructor = f;
        var p = v.toString, h = String(l("test")) == "Symbol(test)", m = /^Symbol\((.*)\)[^)]+$/;
        u(v, "description", { configurable: !0, get: function() {
          var g = a(this) ? this.valueOf() : this, b = p.call(g);
          if (t(c, g)) return "";
          var S = h ? b.slice(7, -1) : b.replace(m, "$1");
          return S === "" ? void 0 : S;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(i, d, e) {
      var n = e("5135"), o = e("7b0b"), r = e("f772"), t = e("e177"), a = r("IE_PROTO"), u = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(s) {
        return s = o(s), n(s, a) ? s[a] : typeof s.constructor == "function" && s instanceof s.constructor ? s.constructor.prototype : s instanceof Object ? u : null;
      };
    }, e177: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function o() {
        }
        return o.prototype.constructor = null, Object.getPrototypeOf(new o()) !== o.prototype;
      });
    }, e260: function(i, d, e) {
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), a = e("7dd0"), u = "Array Iterator", s = t.set, l = t.getterFor(u);
      i.exports = a(Array, "Array", function(c, f) {
        s(this, { type: u, target: n(c), index: 0, kind: f });
      }, function() {
        var c = l(this), f = c.target, v = c.kind, p = c.index++;
        return !f || p >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : v == "keys" ? { value: p, done: !1 } : v == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), r.Arguments = r.Array, o("keys"), o("values"), o("entries");
    }, e2cc: function(i, d, e) {
      var n = e("6eeb");
      i.exports = function(o, r, t) {
        for (var a in r) n(o, a, r[a], t);
        return o;
      };
    }, e439: function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("fc6a"), t = e("06cf").f, a = e("83ab"), u = o(function() {
        t(1);
      }), s = !a || u;
      n({ target: "Object", stat: !0, forced: s, sham: !a }, { getOwnPropertyDescriptor: function(l, c) {
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
      var n, o, r, t, a = e("23e7"), u = e("c430"), s = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), v = e("e2cc"), p = e("d44e"), h = e("2626"), m = e("861d"), g = e("1c0b"), b = e("19aa"), S = e("8925"), C = e("2266"), x = e("1c7e"), w = e("4840"), y = e("2cf4").set, j = e("b575"), E = e("cdf9"), L = e("44de"), O = e("f069"), F = e("e667"), V = e("69f3"), J = e("94ca"), ae = e("b622"), H = e("605d"), W = e("2d00"), U = ae("species"), T = "Promise", A = V.get, z = V.set, ne = V.getterFor(T), R = c, _e = s.TypeError, ve = s.document, Ne = s.process, $e = l("fetch"), Ue = O.f, Ae = Ue, Pe = !!(ve && ve.createEvent && s.dispatchEvent), He = typeof PromiseRejectionEvent == "function", et = "unhandledrejection", $ = "rejectionhandled", B = 0, Z = 1, D = 2, ee = 1, ie = 2, be = J(T, function() {
        var K = S(R) !== String(R);
        if (!K && (W === 66 || !H && !He) || u && !R.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(R)) return !1;
        var se = R.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, he = se.constructor = {};
        return he[U] = fe, !(se.then(function() {
        }) instanceof fe);
      }), ge = be || !x(function(K) {
        R.all(K).catch(function() {
        });
      }), ce = function(K) {
        var se;
        return !(!m(K) || typeof (se = K.then) != "function") && se;
      }, Se = function(K, se) {
        if (!K.notified) {
          K.notified = !0;
          var fe = K.reactions;
          j(function() {
            for (var he = K.value, q = K.state == Z, oe = 0; fe.length > oe; ) {
              var le, me, We, Ye = fe[oe++], at = q ? Ye.ok : Ye.fail, je = Ye.resolve, st = Ye.reject, Je = Ye.domain;
              try {
                at ? (q || (K.rejection === ie && M(K), K.rejection = ee), at === !0 ? le = he : (Je && Je.enter(), le = at(he), Je && (Je.exit(), We = !0)), le === Ye.promise ? st(_e("Promise-chain cycle")) : (me = ce(le)) ? me.call(le, je, st) : je(le)) : st(he);
              } catch (wt) {
                Je && !We && Je.exit(), st(wt);
              }
            }
            K.reactions = [], K.notified = !1, se && !K.rejection && De(K);
          });
        }
      }, Ee = function(K, se, fe) {
        var he, q;
        Pe ? (he = ve.createEvent("Event"), he.promise = se, he.reason = fe, he.initEvent(K, !1, !0), s.dispatchEvent(he)) : he = { promise: se, reason: fe }, !He && (q = s["on" + K]) ? q(he) : K === et && L("Unhandled promise rejection", fe);
      }, De = function(K) {
        y.call(s, function() {
          var se, fe = K.facade, he = K.value, q = re(K);
          if (q && (se = F(function() {
            H ? Ne.emit("unhandledRejection", he, fe) : Ee(et, fe, he);
          }), K.rejection = H || re(K) ? ie : ee, se.error)) throw se.value;
        });
      }, re = function(K) {
        return K.rejection !== ee && !K.parent;
      }, M = function(K) {
        y.call(s, function() {
          var se = K.facade;
          H ? Ne.emit("rejectionHandled", se) : Ee($, se, K.value);
        });
      }, G = function(K, se, fe) {
        return function(he) {
          K(se, he, fe);
        };
      }, Ke = function(K, se, fe) {
        K.done || (K.done = !0, fe && (K = fe), K.value = se, K.state = D, Se(K, !0));
      }, dt = function(K, se, fe) {
        if (!K.done) {
          K.done = !0, fe && (K = fe);
          try {
            if (K.facade === se) throw _e("Promise can't be resolved itself");
            var he = ce(se);
            he ? j(function() {
              var q = { done: !1 };
              try {
                he.call(se, G(dt, q, K), G(Ke, q, K));
              } catch (oe) {
                Ke(q, oe, K);
              }
            }) : (K.value = se, K.state = Z, Se(K, !1));
          } catch (q) {
            Ke({ done: !1 }, q, K);
          }
        }
      };
      be && (R = function(K) {
        b(this, R, T), g(K), n.call(this);
        var se = A(this);
        try {
          K(G(dt, se), G(Ke, se));
        } catch (fe) {
          Ke(se, fe);
        }
      }, n = function(K) {
        z(this, { type: T, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: B, value: void 0 });
      }, n.prototype = v(R.prototype, { then: function(K, se) {
        var fe = ne(this), he = Ue(w(this, R));
        return he.ok = typeof K != "function" || K, he.fail = typeof se == "function" && se, he.domain = H ? Ne.domain : void 0, fe.parent = !0, fe.reactions.push(he), fe.state != B && Se(fe, !1), he.promise;
      }, catch: function(K) {
        return this.then(void 0, K);
      } }), o = function() {
        var K = new n(), se = A(K);
        this.promise = K, this.resolve = G(dt, se), this.reject = G(Ke, se);
      }, O.f = Ue = function(K) {
        return K === R || K === r ? new o(K) : Ae(K);
      }, u || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(K, se) {
        var fe = this;
        return new R(function(he, q) {
          t.call(fe, he, q);
        }).then(K, se);
      }, { unsafe: !0 }), typeof $e == "function" && a({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(K) {
        return E(R, $e.apply(s, arguments));
      } }))), a({ global: !0, wrap: !0, forced: be }, { Promise: R }), p(R, T, !1, !0), h(T), r = l(T), a({ target: T, stat: !0, forced: be }, { reject: function(K) {
        var se = Ue(this);
        return se.reject.call(void 0, K), se.promise;
      } }), a({ target: T, stat: !0, forced: u || be }, { resolve: function(K) {
        return E(u && this === r ? R : this, K);
      } }), a({ target: T, stat: !0, forced: ge }, { all: function(K) {
        var se = this, fe = Ue(se), he = fe.resolve, q = fe.reject, oe = F(function() {
          var le = g(se.resolve), me = [], We = 0, Ye = 1;
          C(K, function(at) {
            var je = We++, st = !1;
            me.push(void 0), Ye++, le.call(se, at).then(function(Je) {
              st || (st = !0, me[je] = Je, --Ye || he(me));
            }, q);
          }), --Ye || he(me);
        });
        return oe.error && q(oe.value), fe.promise;
      }, race: function(K) {
        var se = this, fe = Ue(se), he = fe.reject, q = F(function() {
          var oe = g(se.resolve);
          C(K, function(le) {
            oe.call(se, le).then(fe.resolve, he);
          });
        });
        return q.error && he(q.value), fe.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(a, u) {
        for (var s = o(u), l = t.f, c = r.f, f = 0; f < s.length; f++) {
          var v = s[f];
          n(a, v) || l(a, v, c(u, v));
        }
      };
    }, e8b5: function(i, d, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(o) {
        return n(o) == "Array";
      };
    }, e95a: function(i, d, e) {
      var n = e("b622"), o = e("3f8c"), r = n("iterator"), t = Array.prototype;
      i.exports = function(a) {
        return a !== void 0 && (o.Array === a || t[r] === a);
      };
    }, ec57: function(i, d, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function o(t) {
        var a = r(t);
        return e(a);
      }
      function r(t) {
        if (!e.o(n, t)) {
          var a = new Error("Cannot find module '" + t + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        return n[t];
      }
      o.keys = function() {
        return Object.keys(n);
      }, o.resolve = r, i.exports = o, o.id = "ec57";
    }, f069: function(i, d, e) {
      var n = e("1c0b"), o = function(r) {
        var t, a;
        this.promise = new r(function(u, s) {
          if (t !== void 0 || a !== void 0) throw TypeError("Bad Promise constructor");
          t = u, a = s;
        }), this.resolve = n(t), this.reject = n(a);
      };
      i.exports.f = function(r) {
        return new o(r);
      };
    }, f183: function(i, d, e) {
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, a = e("90e3"), u = e("bb2f"), s = a("meta"), l = 0, c = Object.isExtensible || function() {
        return !0;
      }, f = function(g) {
        t(g, s, { value: { objectID: "O" + ++l, weakData: {} } });
      }, v = function(g, b) {
        if (!o(g)) return typeof g == "symbol" ? g : (typeof g == "string" ? "S" : "P") + g;
        if (!r(g, s)) {
          if (!c(g)) return "F";
          if (!b) return "E";
          f(g);
        }
        return g[s].objectID;
      }, p = function(g, b) {
        if (!r(g, s)) {
          if (!c(g)) return !0;
          if (!b) return !1;
          f(g);
        }
        return g[s].weakData;
      }, h = function(g) {
        return u && m.REQUIRED && c(g) && !r(g, s) && f(g), g;
      }, m = i.exports = { REQUIRED: !1, fastKey: v, getWeakData: p, onFreeze: h };
      n[s] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), a = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(s, l) {
        try {
          return s[l];
        } catch {
        }
      };
      i.exports = n ? o : function(s) {
        var l, c, f;
        return s === void 0 ? "Undefined" : s === null ? "Null" : typeof (c = u(l = Object(s), t)) == "string" ? c : a ? o(l) : (f = o(l)) == "Object" && typeof l.callee == "function" ? "Arguments" : f;
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
      var t = e("8bbf"), a = { class: "key-board-container" }, u = { class: "key-board-area" };
      function s(k, I, P, N, Q, ue) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), ye = Object(t.resolveComponent)("HandBoard"), Ve = Object(t.resolveComponent)("svg-icon"), qe = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: k.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [k.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: I[1] || (I[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", a, [Object(t.createVNode)(pe, { data: k.resultVal, onChange: k.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [k.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: k.trigger, onChange: k.change, onTranslate: k.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), k.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ye, { key: 1, onTrigger: k.trigger, onChange: k.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), k.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: k.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(k.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Ve, { "icon-class": "drag" })], 4)), [[qe]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(k, I, P) {
        return I in k ? Object.defineProperty(k, I, { value: P, enumerable: !0, configurable: !0, writable: !0 }) : k[I] = P, k;
      }
      function c(k, I) {
        var P = Object.keys(k);
        if (Object.getOwnPropertySymbols) {
          var N = Object.getOwnPropertySymbols(k);
          I && (N = N.filter(function(Q) {
            return Object.getOwnPropertyDescriptor(k, Q).enumerable;
          })), P.push.apply(P, N);
        }
        return P;
      }
      function f(k) {
        for (var I = 1; I < arguments.length; I++) {
          var P = arguments[I] != null ? arguments[I] : {};
          I % 2 ? c(Object(P), !0).forEach(function(N) {
            l(k, N, P[N]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(k, Object.getOwnPropertyDescriptors(P)) : c(Object(P)).forEach(function(N) {
            Object.defineProperty(k, N, Object.getOwnPropertyDescriptor(P, N));
          });
        }
        return k;
      }
      function v(k, I) {
        (I == null || I > k.length) && (I = k.length);
        for (var P = 0, N = new Array(I); P < I; P++) N[P] = k[P];
        return N;
      }
      function p(k) {
        if (Array.isArray(k)) return v(k);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function h(k) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(k)) return Array.from(k);
      }
      e("fb6a");
      function m(k, I) {
        if (k) {
          if (typeof k == "string") return v(k, I);
          var P = Object.prototype.toString.call(k).slice(8, -1);
          return P === "Object" && k.constructor && (P = k.constructor.name), P === "Map" || P === "Set" ? Array.from(k) : P === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(P) ? v(k, I) : void 0;
        }
      }
      function g() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(k) {
        return p(k) || h(k) || m(k) || g();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function S(k, I) {
        if (!(k instanceof I)) throw new TypeError("Cannot call a class as a function");
      }
      function C(k, I) {
        for (var P = 0; P < I.length; P++) {
          var N = I[P];
          N.enumerable = N.enumerable || !1, N.configurable = !0, "value" in N && (N.writable = !0), Object.defineProperty(k, N.key, N);
        }
      }
      function x(k, I, P) {
        return I && C(k.prototype, I), k;
      }
      var w = function() {
        function k() {
          S(this, k), this.listeners = {};
        }
        return x(k, [{ key: "on", value: function(I, P) {
          var N = this, Q = this.listeners[I];
          return Q || (Q = []), Q.push(P), this.listeners[I] = Q, function() {
            N.remove(I, P);
          };
        } }, { key: "emit", value: function(I) {
          var P = this.listeners[I];
          if (Array.isArray(P)) {
            for (var N = arguments.length, Q = new Array(N > 1 ? N - 1 : 0), ue = 1; ue < N; ue++) Q[ue - 1] = arguments[ue];
            for (var pe = 0; pe < P.length; pe++) {
              var de = P[pe];
              typeof de == "function" && de.apply(void 0, Q);
            }
          }
        } }, { key: "remove", value: function(I, P) {
          if (P) {
            var N = this.listeners[I];
            if (!N) return;
            N = N.filter(function(Q) {
              return Q !== P;
            }), this.listeners[I] = N;
          } else this.listeners[I] = null, delete this.listeners[I];
        } }]), k;
      }(), y = new w(), j = { mounted: function(k, I, P) {
        var N = k.parentNode;
        k.onmousedown = function(Q) {
          var ue = Q.clientX - N.offsetLeft, pe = Q.clientY - N.offsetTop;
          document.onmousemove = function(de) {
            var ye = de.clientX - ue, Ve = de.clientY - pe;
            N.style.left = ye + "px", N.style.top = Ve + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, k.ontouchstart = function(Q) {
          var ue = Q.touches[0].pageX, pe = Q.touches[0].pageY, de = ue - N.offsetLeft, ye = pe - N.offsetTop;
          document.ontouchmove = function(Ve) {
            var qe = Ve.touches[0].pageX, Qe = Ve.touches[0].pageY, Xe = qe - de, gt = Qe - ye;
            N.style.left = Xe + "px", N.style.top = gt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, E = j, L = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var O = { key: 0, class: "key-board-code-show" }, F = { class: "key-board-result-show" }, V = { class: "key-board-result-show-container" }, J = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = L(function(k, I, P, N, Q, ue) {
        return k.status === "CN" || k.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: k.color } }, [k.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", O, Object(t.toDisplayString)(k.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", F, [Object(t.createVNode)("div", V, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.showList[k.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(ye) {
            return k.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), k.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", J, [Object(t.createVNode)("span", { style: k.getStyle, onClick: I[1] || (I[1] = function() {
          return k.upper && k.upper.apply(k, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: k.getStyle, onClick: I[2] || (I[2] = function() {
          return k.lower && k.lower.apply(k, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(k, I) {
        for (var P = 0, N = []; P < k.length; ) N.push(k.slice(P, P += I));
        return N;
      }), W = Symbol("KEYBOARD_CONTEXT"), U = function(k) {
        Object(t.provide)(W, k);
      }, T = function() {
        return Object(t.inject)(W);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(k, I) {
        var P = I.emit, N = T(), Q = Object(t.computed)(function() {
          return { borderTopColor: N == null ? void 0 : N.color };
        }), ue = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function pe() {
          ue.showIndex !== 0 && (ue.showIndex -= 1);
        }
        function de() {
          ue.showIndex !== ue.showList.length - 1 && (ue.showIndex += 1);
        }
        function ye() {
          ue.showIndex = 0, ue.showList = [], ue.valueList = [], y.emit("resultReset");
        }
        function Ve(qe) {
          ye(), P("change", qe);
        }
        return Object(t.watch)(function() {
          return k.data;
        }, function(qe) {
          var Qe;
          ue.showIndex = 0, ue.valueList = (qe == null || (Qe = qe.value) === null || Qe === void 0 ? void 0 : Qe.split("")) || [], ue.valueList.length !== 0 ? ue.showList = H(ue.valueList, 11) : ue.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          y.on("keyBoardChange", function(qe) {
            y.emit("updateBound"), ue.status = qe, ye();
          }), y.on("getWordsFromServer", function(qe) {
            var Qe = Array.from(new Set(qe.replace(/\s+/g, "").split("")));
            ue.valueList = Qe, ue.showList = H(Qe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          y.remove("keyBoardChange"), y.remove("getWordsFromServer");
        }), f({ color: N == null ? void 0 : N.color, upper: pe, lower: de, getStyle: Q, selectWord: Ve }, Object(t.toRefs)(ue));
      } });
      e("e66c"), A.render = ae, A.__scopeId = "data-v-02e63132";
      var z = A, ne = e("bc3a"), R = e.n(ne), _e = 15e3, ve = function(k) {
        R.a.defaults.baseURL = k, R.a.defaults.timeout = _e, R.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ne(k, I, P, N, Q, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: k.color } }, [Object(t.createVNode)("use", { "xlink:href": k.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var $e = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(k) {
        var I = T(), P = Object(t.computed)(function() {
          return "#icon-".concat(k.iconClass);
        });
        return { color: I == null ? void 0 : I.color, iconName: P };
      } });
      e("38cd"), $e.render = Ne;
      var Ue = $e, Ae = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Pe = { class: "hand-write-board" }, He = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var et = Ae(function(k, I, P, N, Q, ue) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Pe, [Object(t.createVNode)(pe, { lib: k.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", He, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.handBoardOperList, function(ye) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: ye.type, type: ye.type, data: ye.data, isCn: k.isCn, onClick: k.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), $ = { class: "paint-board" };
      function B(k, I, P, N, Q, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", $, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: k.width, height: k.height, onTouchstart: I[1] || (I[1] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onTouchmove: I[2] || (I[2] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onTouchend: I[3] || (I[3] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMousedown: I[4] || (I[4] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onMousemove: I[5] || (I[5] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onMouseup: I[6] || (I[6] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMouseleave: I[7] || (I[7] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function Z(k, I, P, N, Q, ue, pe) {
        try {
          var de = k[ue](pe), ye = de.value;
        } catch (Ve) {
          return void P(Ve);
        }
        de.done ? I(ye) : Promise.resolve(ye).then(N, Q);
      }
      function D(k) {
        return function() {
          var I = this, P = arguments;
          return new Promise(function(N, Q) {
            var ue = k.apply(I, P);
            function pe(ye) {
              Z(ue, N, Q, pe, de, "next", ye);
            }
            function de(ye) {
              Z(ue, N, Q, pe, de, "throw", ye);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ee, ie, be = function() {
        var k = D(regeneratorRuntime.mark(function I(P, N, Q, ue) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, R.a.post("", { lib: ue, lpXis: P, lpYis: N, lpCis: Q });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, I);
        }));
        return function(I, P, N, Q) {
          return k.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(k) {
        var I = T(), P = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), N = Object(t.ref)(null);
        function Q() {
          return ue.apply(this, arguments);
        }
        function ue() {
          return ue = D(regeneratorRuntime.mark(function Be() {
            var Ge, ze;
            return regeneratorRuntime.wrap(function(nt) {
              for (; ; ) switch (nt.prev = nt.next) {
                case 0:
                  return nt.next = 2, be(P.clickX, P.clickY, P.clickC, k.lib);
                case 2:
                  Ge = nt.sent, ze = Ge.data, y.emit("getWordsFromServer", (ze == null ? void 0 : ze.v) || "");
                case 5:
                case "end":
                  return nt.stop();
              }
            }, Be);
          })), ue.apply(this, arguments);
        }
        function pe() {
          N.value && ee && (P.clickX = [], P.clickY = [], P.clickC = [], ee.clearRect(0, 0, P.width, P.height));
        }
        function de(Be) {
          if (Be.type.includes("mouse")) {
            var Ge = Be;
            return Math.floor(Ge.clientX - P.x);
          }
          if (Be.type.includes("touch")) {
            var ze, nt = Be;
            return Math.floor(((ze = nt.targetTouches[0]) === null || ze === void 0 ? void 0 : ze.clientX) - P.x);
          }
          return 0;
        }
        function ye(Be) {
          if (Be.type.includes("mouse")) {
            var Ge = Be;
            return Math.floor(Ge.clientY - P.y);
          }
          if (Be.type.includes("touch")) {
            var ze, nt = Be;
            return Math.floor(((ze = nt.targetTouches[0]) === null || ze === void 0 ? void 0 : ze.clientY) - P.y);
          }
          return 0;
        }
        function Ve(Be) {
          if (ee) {
            P.isMouseDown = !0;
            var Ge = de(Be), ze = ye(Be);
            clearTimeout(ie), P.oldX = Ge, P.oldY = ze, ee.beginPath();
          }
        }
        function qe(Be) {
          if (ee && (Be.preventDefault(), P.isMouseDown)) {
            var Ge = de(Be), ze = ye(Be);
            P.clickX.push(Ge), P.clickY.push(ze), P.clickC.push(0), ee.strokeStyle = I == null ? void 0 : I.color, ee.fillStyle = I == null ? void 0 : I.color, ee.lineWidth = 4, ee.lineCap = "round", ee.moveTo(P.oldX, P.oldY), ee.lineTo(Ge, ze), ee.stroke(), P.oldX = Ge, P.oldY = ze;
          }
        }
        function Qe() {
          P.isMouseDown && (P.isMouseDown = !1, ie = setTimeout(function() {
            pe();
          }, 1500), P.clickC.pop(), P.clickC.push(1), Q());
        }
        function Xe() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Be = document.querySelector(".paint-board").getBoundingClientRect();
              P.x = Be.x, P.y = Be.y, P.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), P.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function gt() {
          var Be;
          ee = (Be = N.value) === null || Be === void 0 ? void 0 : Be.getContext("2d"), pe(), Xe(), window.addEventListener("animationend", Xe), window.addEventListener("resize", Xe), window.addEventListener("scroll", Xe);
        }
        return Object(t.onMounted)(function() {
          gt(), y.on("updateBound", function() {
            Xe();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", Xe), window.removeEventListener("resize", Xe), window.removeEventListener("scroll", Xe), y.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(P)), {}, { move: qe, down: Ve, mouseup: Qe, canvasRef: N });
      } });
      ge.render = B;
      var ce = ge;
      function Se(k, I, P, N, Q, ue) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(k.type), { "key-board-button-active": k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" }], style: k.getStyle, onClick: I[1] || (I[1] = function() {
          return k.click && k.click.apply(k, arguments);
        }), onMouseenter: I[2] || (I[2] = function(de) {
          return k.isHoverStatus = !0;
        }), onMouseleave: I[3] || (I[3] = function(de) {
          return k.isHoverStatus = !1;
        }) }, [k.type === "upper" || k.type === "delete" || k.type === "handwrite" || k.type === "close" || k.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": k.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: k.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Ee = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ue }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(k, I) {
        var P = I.emit, N = T(), Q = Object(t.ref)(!1), ue = Object(t.computed)(function() {
          return k.type === "change2lang" ? k.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : k.isUpper ? k.data.toUpperCase() : k.data;
        }), pe = Object(t.computed)(function() {
          return k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" || Q.value ? { color: "#f5f5f5", background: N == null ? void 0 : N.color } : { color: N == null ? void 0 : N.color, background: "#f5f5f5" };
        });
        function de(ye) {
          ye.preventDefault(), P("click", { data: k.isUpper ? k.data.toUpperCase() : k.data, type: k.type });
        }
        return { isHoverStatus: Q, getStyle: pe, getCode: ue, click: de };
      } });
      e("de23"), Ee.render = Se;
      var De = Ee, re = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ce, KeyCodeButton: De }, setup: function(k, I) {
        var P = I.emit, N = T(), Q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ue(pe) {
          var de = pe.data, ye = pe.type;
          switch (ye) {
            case "close":
              N == null || N.closeKeyBoard();
              break;
            case "back":
              N == null || N.changeDefaultBoard(), y.emit("resultReset"), y.emit("keyBoardChange", Q.isCn && "CN");
              break;
            case "change2lang":
              Q.isCn = !Q.isCn;
              break;
            case "delete":
              P("trigger", { data: de, type: ye });
              break;
          }
        }
        return f({ click: ue }, Object(t.toRefs)(Q));
      } });
      e("9aaf"), re.render = et, re.__scopeId = "data-v-1b5e0983";
      var M = re, G = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Ke = { class: "default-key-board" }, dt = { class: "line line4" };
      Object(t.popScopeId)();
      var K = G(function(k, I, P, N, Q, ue) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ke, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.lineList, function(de, ye) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ye + 1)], key: ye }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function(Ve) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: k.isUpper, key: Ve, type: Ve, data: Ve, isSymbol: k.isSymbol, onClick: k.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", dt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: k.isCn, isNum: k.isNum, onClick: k.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), se = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, he = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: De }, emits: ["translate", "trigger", "change"], setup: function(k, I) {
        var P = I.emit, N = T(), Q = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ue() {
          var de;
          Q.line4 = JSON.parse(JSON.stringify(q)), N != null && (de = N.modeList) !== null && de !== void 0 && de.find(function(ye) {
            return ye === "handwrite";
          }) && N !== null && N !== void 0 && N.handApi && Q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var ye = de.data, Ve = de.type;
          switch (Ve) {
            case "close":
              Q.oldVal = "", N == null || N.closeKeyBoard();
              break;
            case "upper":
              Q.oldVal = "", Q.isUpper = !Q.isUpper;
              break;
            case "change2lang":
              Q.isCn = !Q.isCn, Q.isNum || Q.isSymbol || y.emit("keyBoardChange", Q.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (Q.isNum = !Q.isNum, Q.isSymbol = !1, Q.isNum) {
                var qe;
                y.emit("keyBoardChange", "number");
                var Qe = JSON.parse(JSON.stringify(he.line3));
                N != null && (qe = N.modeList) !== null && qe !== void 0 && qe.find(function(Xe) {
                  return Xe === "symbol";
                }) || (Qe.shift(), Qe.unshift("+")), Q.lineList = [he.line1, he.line2, Qe];
              } else y.emit("keyBoardChange", Q.isCn ? "CN" : "EN"), Q.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              Q.isSymbol = !Q.isSymbol, Q.isSymbol ? (y.emit("keyBoardChange", "symbol"), Q.lineList = [se.line1, se.line2, se.line3]) : (y.emit("keyBoardChange", "number"), Q.lineList = [he.line1, he.line2, he.line3]);
              break;
            case "handwrite":
            case "delete":
              Q.isCn && Ve === "delete" && Q.oldVal ? (Q.oldVal = Q.oldVal.substr(0, Q.oldVal.length - 1), P("translate", Q.oldVal)) : (Ve === "handwrite" && y.emit("keyBoardChange", "handwrite"), P("trigger", { data: ye, type: Ve }));
              break;
            default:
              !Q.isCn || Q.isNum || Q.isSymbol ? P("change", ye) : (P("translate", Q.oldVal + ye), Q.oldVal = Q.oldVal + ye);
              break;
          }
        }
        return ue(), Object(t.onMounted)(function() {
          y.on("resultReset", function() {
            Q.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(Q)), {}, { click: pe });
      } });
      e("f8b0"), oe.render = K, oe.__scopeId = "data-v-4b78e5a1";
      var le = oe, me = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, We = e("ec57"), Ye = function(k) {
        return k.keys().map(k);
      };
      Ye(We);
      var at = [], je = null, st = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: E }, components: { Result: z, SvgIcon: Ue, HandBoard: M, DefaultBoard: le }, setup: function(k, I) {
        var P = I.emit, N = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), Q = Object(t.ref)(null);
        function ue(Te) {
          var Le, Ie;
          switch (Object(t.nextTick)(function() {
            y.emit("keyBoardChange", "CN");
          }), Te) {
            case "en":
              N.showMode = "default", Object(t.nextTick)(function() {
                var Re;
                (Re = Q.value) === null || Re === void 0 || Re.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              N.showMode = "default", Object(t.nextTick)(function() {
                var Re;
                (Re = Q.value) === null || Re === void 0 || Re.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Le = k.modeList) !== null && Le !== void 0 && Le.find(function(Re) {
                return Re === "handwrite";
              }) && k.handApi ? (N.showMode = "handwrite", Object(t.nextTick)(function() {
                y.emit("keyBoardChange", "handwrite");
              })) : N.showMode = "default";
              break;
            case "symbol":
              N.showMode = "default", (Ie = k.modeList) !== null && Ie !== void 0 && Ie.find(function(Re) {
                return Re === "symbol";
              }) && Object(t.nextTick)(function() {
                var Re, ut;
                (Re = Q.value) === null || Re === void 0 || Re.click({ data: ".?123", type: "change2num" }), (ut = Q.value) === null || ut === void 0 || ut.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              N.showMode = "default";
              break;
          }
        }
        function pe(Te) {
          if (N.visible = !0, je = Te.target, ue(je.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Le = document.querySelector(".key-board-modal");
            Le.style.display = "block";
          }
        }
        function de() {
          if (je && je.blur(), je = null, N.visible = !1, P("closed"), N.showMode = "default", N.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Te = document.querySelector(".key-board-modal");
            Te.style.display = "none";
          }
        }
        function ye() {
          k.closeOnClickModal && de(), P("modalClick");
        }
        function Ve() {
          var Te;
          if (document.querySelector(".key-board-modal")) {
            var Le;
            (Le = document.querySelector(".key-board-modal")) === null || Le === void 0 || Le.addEventListener("click", ye);
          } else {
            var Ie = document.createElement("div");
            Ie.className = "key-board-modal", Ie.style.display = "none", (Te = document.querySelector("body")) === null || Te === void 0 || Te.appendChild(Ie), Ie.addEventListener("click", ye);
          }
        }
        function qe() {
          k.handApi && ve(k.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(Te) {
            Te.getAttribute("data-mode") !== null && (at.push(Te), Te.addEventListener("focus", pe), k.blurHide && Te.addEventListener("blur", de));
          });
        }
        function Qe(Te) {
          if (!je) return "";
          var Le = je, Ie = Le.selectionStart, Re = Le.selectionEnd;
          if (!Ie || !Re) return "";
          var ut = Te.substring(0, Ie - 1) + Te.substring(Re);
          return Le.value = ut, Le.focus(), Le.selectionStart = Ie - 1, Le.selectionEnd = Ie - 1, ut;
        }
        function Xe(Te) {
          var Le = Te.type;
          switch (Le) {
            case "handwrite":
              N.showMode = "handwrite";
              break;
            case "delete":
              if (!je) return;
              var Ie = Qe(je.value);
              je.value = Ie, P("change", Ie, je.getAttribute("data-prop") || je);
              break;
          }
        }
        function gt(Te, Le) {
          if (!je) return "";
          var Ie = je, Re = Ie.selectionStart || 0, ut = Ie.selectionEnd || 0, Et = Te.substring(0, Re) + Le + Te.substring(ut);
          return Ie.value = Et, Ie.focus(), Ie.selectionStart = Re + Le.length, Ie.selectionEnd = Re + Le.length, Et;
        }
        function Be(Te) {
          if (je) {
            var Le = gt(je.value, Te);
            je.value = Le, P("change", Le, je.getAttribute("data-prop") || je), P("keyChange", Te, je.getAttribute("data-prop") || je);
          }
        }
        function Ge(Te) {
          var Le = new RegExp("^".concat(Te, "\\w*")), Ie = Object.keys(me).filter(function(Re) {
            return Le.test(Re);
          }).sort();
          N.resultVal = { code: Te, value: Te ? Ie.length > 1 ? Ie.reduce(function(Re, ut) {
            return Re + me[ut];
          }, "") : me[Ie[0]] : "" }, je && P("keyChange", Te, je.getAttribute("data-prop") || je);
        }
        function ze() {
          qe();
        }
        function nt() {
          return je;
        }
        return Object(t.onMounted)(function() {
          k.modal && Ve(), qe(), y.on("resultReset", function() {
            N.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Te;
          (Te = document.querySelector(".key-board-modal")) === null || Te === void 0 || Te.removeEventListener("click", ye), at.forEach(function(Le) {
            Le.removeEventListener("focus", pe), Le.removeEventListener("blur", de);
          });
        }), U(Object(t.reactive)({ color: k.color, modeList: k.modeList, handApi: k.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          N.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(N)), {}, { defaultBoardRef: Q, getCurrentInput: nt, translate: Ge, reSignUp: ze, trigger: Xe, change: Be });
      } });
      st.render = s;
      var Je = st;
      Je.install = function(k) {
        k.component(Je.name, Je);
      };
      var wt = Je, $t = wt;
      d.default = $t;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), a = e("50c4"), u = e("fc6a"), s = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), v = l("species"), p = [].slice, h = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(m, g) {
        var b, S, C, x = u(this), w = a(x.length), y = t(m, w), j = t(g === void 0 ? w : g, w);
        if (r(x) && (b = x.constructor, typeof b != "function" || b !== Array && !r(b.prototype) ? o(b) && (b = b[v], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return p.call(x, y, j);
        for (S = new (b === void 0 ? Array : b)(h(j - y, 0)), C = 0; y < j; y++, C++) y in x && s(S, C, x[y]);
        return S.length = C, S;
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
    function ke(te, X) {
      console.log("change value ---->", te), console.log("change input dom ---->", X);
    }
    return {
      change: ke
    };
  }
});
const Ko = { class: "wifi-component" }, Qo = { class: "row" }, Ho = { class: "column" }, Yo = { class: "column" }, Xo = { class: "status" }, Go = { class: "row" }, Jo = { class: "column" }, Zo = {
  key: 0,
  class: "wifi-modal"
}, er = { class: "wifi-modal-content" }, tr = { class: "wifi-list" }, nr = {
  key: 0,
  class: "no-wifi"
}, or = ["onClick"], rr = { class: "wifi-ssid" }, ir = { class: "signal-strength" }, ar = {
  __name: "WiFi",
  setup(ke) {
    const { sendToPyQt: te } = tt(), X = Y("未连接"), i = Y("无网络"), d = Y("未知"), e = Y(""), n = Y(""), o = Y(!1), r = Y([]), t = Y(null), a = () => {
      te("check_wifi_status", {});
    }, u = () => {
      t.value = setInterval(a, 5e3);
    }, s = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ht(() => {
      u();
      const { message: m } = tt();
      lt(m, (g) => {
        if (g && g.type === "wifi_list") {
          const b = JSON.parse(g.content);
          r.value = b;
        } else if (g && g.type === "wifi_status") {
          const b = JSON.parse(g.content);
          X.value = b.wifi_name, i.value = b.internet_status, d.value = b.zerotier_ip;
        }
      });
    }), St(() => {
      s();
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
    }, h = (m, g) => {
      g.placeholder === "WiFi 名称" ? e.value = m : g.placeholder === "WiFi 密码" && (n.value = m);
    };
    return (m, g) => (we(), xe("div", Ko, [
      _("div", Qo, [
        _("div", Ho, [
          pt(_("input", {
            "onUpdate:modelValue": g[0] || (g[0] = (b) => e.value = b),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [mt, e.value]
          ])
        ]),
        _("div", Yo, [
          _("div", Xo, [
            ft(" WiFi: " + Ce(X.value) + " | 网络: " + Ce(i.value) + " ", 1),
            g[2] || (g[2] = _("br", null, null, -1)),
            ft(" zerotier ip地址: " + Ce(d.value), 1)
          ])
        ])
      ]),
      _("div", Go, [
        _("div", Jo, [
          pt(_("input", {
            "onUpdate:modelValue": g[1] || (g[1] = (b) => n.value = b),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [mt, n.value]
          ])
        ]),
        _("div", { class: "column" }, [
          _("div", { class: "button-group" }, [
            _("button", { onClick: l }, "搜索可用 WiFi"),
            _("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      Ze(Ut(Pt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: h,
        class: "scaled-keyboard"
      }),
      o.value ? (we(), xe("div", Zo, [
        _("div", er, [
          g[4] || (g[4] = _("h2", null, "可用的WiFi网络", -1)),
          _("div", tr, [
            r.value.length === 0 ? (we(), xe("div", nr, g[3] || (g[3] = [
              _("div", { class: "loading-spinner" }, null, -1),
              _("div", null, "搜索中...", -1)
            ]))) : (we(!0), xe(rt, { key: 1 }, it(r.value, (b) => (we(), xe("div", {
              key: b.ssid,
              class: "wifi-item",
              onClick: (S) => v(b)
            }, [
              _("span", rr, Ce(b.ssid), 1),
              _("span", ir, "信号强度: " + Ce(b.signal), 1)
            ], 8, or))), 128))
          ]),
          _("div", { class: "modal-buttons" }, [
            _("button", { onClick: c }, "重新搜索"),
            _("button", { onClick: f }, "关闭")
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
  setup(ke, { emit: te }) {
    const X = ke, i = te, d = Y([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = Y("");
    lt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => ke.showKeyboard ? (we(), xe("div", ur, [
      _("div", cr, [
        _("div", lr, Ce(e.value), 1),
        (we(!0), xe(rt, null, it(d.value, (t) => (we(), xe("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), xe(rt, null, it(t, (a) => (we(), xe("button", {
            key: a,
            onClick: (u) => n(a),
            class: ot({ "function-key": a === "清除" || a === "确定" })
          }, Ce(a), 11, dr))), 128))
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
  setup(ke, { emit: te }) {
    const { sendToPyQt: X } = tt(), i = bt({
      isPyQtWebEngine: !1
    }), d = Y("未激活"), e = Y(0), n = Y(""), o = Y(""), r = Y(!1), t = Y(7776e3);
    let a, u;
    const s = Y(0), l = Y(1), c = Y(null), f = Y(!1), v = Y(!1), p = yt(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${h.value}`), h = yt(() => {
      const H = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), U = Math.floor(e.value % (60 * 60) / 60), T = e.value % 60;
      return `${H}天 ${W.toString().padStart(2, "0")}:${U.toString().padStart(2, "0")}:${T.toString().padStart(2, "0")}`;
    }), m = yt(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function g(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), s.value = 0, u = setInterval(() => {
        s.value += 2, s.value >= 100 && (clearInterval(u), C());
      }, 30));
    }
    function b(H) {
      H.target.releasePointerCapture(H.pointerId), S();
    }
    function S() {
      clearInterval(u), s.value = 0;
    }
    function C() {
      X("activate_device", {});
    }
    function x(H, W) {
      X("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: W } }), d.value = "已激活", n.value = H, c.value = W, w();
    }
    function w() {
      y(), a = setInterval(() => {
        e.value > 0 ? y() : j();
      }, 1e3);
    }
    function y() {
      const H = Date.now(), W = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - H) / 1e3));
    }
    function j() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(a), ae();
    }
    function E() {
      L(o.value);
    }
    function L(H) {
      X("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function O() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(a);
    }
    function F() {
      r.value = !1, document.body.style.overflow = "auto", l.value++, a && clearInterval(a), w();
    }
    St(() => {
      clearInterval(a), clearInterval(u);
    }), ht(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = tt();
        lt(H, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const U = JSON.parse(W.content);
              U.target === "attemptUnlock" && (U.result === "success" ? (r.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, X("update_baseTime", c.value), F(), X("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : U.result === "forever_success" ? (O(), X("Lock_set_response", { method: "permanentUnlock", args: {} })) : X("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (U) {
              console.error("Failed to parse confirm lock password :", U);
            }
          else if (W && W.type === "device_activated")
            try {
              const U = JSON.parse(W.content);
              x(U.device_random_code, U.device_base_time);
            } catch (U) {
              console.error("Failed to parse device activation result:", U);
            }
          else if (W && W.type === "device_info")
            try {
              const U = JSON.parse(W.content);
              d.value = U.device_status, n.value = U.device_random_code, l.value = U.device_lock_count, c.value = U.device_base_time, U.device_status === "已激活" ? w() : U.device_status === "永久激活" && O();
            } catch (U) {
              console.error("Failed to parse device status:", U);
            }
          else if (W && W.type === "Lock_init")
            V();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const U = JSON.parse(W.content);
            U.method === "requestActivation" ? C() : U.method === "attemptUnlock" && L(U.args.password);
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
        progressWidth: s.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: v.value
      };
      console.log("Sending Lock initial state:", H), X("Lock_init_response", H);
    }, J = te, ae = () => {
      J("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, W) => (we(), xe("div", pr, [
      _("div", vr, [
        _("div", hr, Ce(p.value), 1),
        _("button", {
          class: "activation-button",
          onPointerdown: g,
          onPointerup: b,
          onPointercancel: S,
          onPointerleave: S,
          disabled: d.value !== "未激活"
        }, [
          ft(Ce(m.value) + " ", 1),
          _("div", {
            class: "progress-bar",
            style: Dt({ width: s.value + "%" })
          }, null, 4)
        ], 40, mr)
      ]),
      _("div", gr, [
        pt(_("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (U) => o.value = U),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (U) => f.value = !0)
        }, null, 544), [
          [mt, o.value]
        ]),
        _("button", {
          class: "unlock-button",
          onClick: E
        }, "解锁")
      ]),
      r.value ? (we(), xe("div", yr, [
        _("div", br, [
          W[8] || (W[8] = _("h3", null, "设备已锁定", -1)),
          _("h3", null, "第 " + Ce(l.value) + " 次锁定", 1),
          _("h3", null, "设备随机码: " + Ce(n.value), 1),
          pt(_("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (U) => o.value = U),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (U) => v.value = !0)
          }, null, 544), [
            [mt, o.value]
          ]),
          _("button", {
            class: "unlock-button",
            onClick: E
          }, "解锁")
        ])
      ])) : ct("", !0),
      Ze(Ct, {
        modelValue: o.value,
        "onUpdate:modelValue": W[4] || (W[4] = (U) => o.value = U),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (U) => f.value = U)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Ze(Ct, {
        modelValue: o.value,
        "onUpdate:modelValue": W[6] || (W[6] = (U) => o.value = U),
        showKeyboard: v.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (U) => v.value = U)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, xr = /* @__PURE__ */ vt(wr, [["__scopeId", "data-v-3d3fd364"]]), kr = { class: "app-container" }, Sr = {
  __name: "App",
  setup(ke) {
    Mt();
    const te = Y(""), X = (i) => {
      te.value = i;
    };
    return (i, d) => (we(), xe("div", kr, [
      d[0] || (d[0] = _("h1", null, "涪特智能养护台车控制系统", -1)),
      Ze(Un),
      Ze(Vo),
      Ze(ln),
      Ze(To, { message: te.value }, null, 8, ["message"]),
      Ze(sr),
      Ze(xr, { onMessageFromA: X })
    ]));
  }
};
export {
  Sr as default
};
