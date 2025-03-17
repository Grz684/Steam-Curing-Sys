import Nt, { ref as V, onMounted as dt, provide as bt, readonly as wt, inject as xt, watch as et, openBlock as xe, createElementBlock as ke, createElementVNode as _, toDisplayString as Te, Fragment as ot, renderList as ct, normalizeClass as nt, createCommentVNode as st, reactive as gt, createVNode as ze, withDirectives as lt, vModelRadio as Ot, createTextVNode as ft, vModelText as ht, computed as vt, onUnmounted as _t, normalizeStyle as kt, vModelCheckbox as Rt, defineComponent as $t, unref as Bt } from "vue";
const Et = Symbol(), Ct = Symbol(), Tt = Symbol();
function It(be, Y) {
  be && be.messageSignal ? be.messageSignal.connect((X) => {
    try {
      const i = JSON.parse(X);
      Y.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), Y.value = { type: "unknown", content: X };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const be = V(null), Y = V(null), X = V("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      be.value = d, Y.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), It(Y.value, X), Y.value && typeof Y.value.vueReady == "function" ? Y.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  dt(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), bt(Et, wt(be)), bt(Ct, wt(Y)), bt(Tt, wt(X));
}
function Xe() {
  const be = xt(Et), Y = xt(Ct), X = xt(Tt);
  return (!be || !Y || !X) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: Y,
    message: X,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), Y && Y.value)
        if (typeof Y.value.sendToPyQt == "function")
          try {
            Y.value.sendToPyQt(d, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(Y.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ut = (be, Y) => {
  const X = be.__vccOpts || be;
  for (const [i, d] of Y)
    X[i] = d;
  return X;
}, Dt = {
  key: 0,
  class: "numeric-keyboard"
}, Ft = { class: "keyboard" }, Mt = { class: "current-value" }, Vt = ["onClick"], Wt = {
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
  setup(be, { emit: Y }) {
    const X = be, i = Y, d = V([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = V("");
    et(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => be.showKeyboard ? (xe(), ke("div", Dt, [
      _("div", Ft, [
        _("div", Mt, Te(e.value), 1),
        (xe(!0), ke(ot, null, ct(d.value, (t) => (xe(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (xe(!0), ke(ot, null, ct(t, (a) => (xe(), ke("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({ "function-key": a === "清除" || a === "确定" })
          }, Te(a), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, pt = /* @__PURE__ */ ut(Wt, [["__scopeId", "data-v-541feda2"]]), qt = { class: "settings-container" }, Kt = { class: "setting-group" }, zt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, on = { class: "setting-controls" }, rn = ["value"], an = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: Y } = Xe(), X = gt({
      isPyQtWebEngine: !1
    }), i = V(35), d = V(25), e = V(95), n = V(90), o = V(!1), r = V(null), t = V("");
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = Xe();
        et(g, (v) => {
          if (v && v.type === "update_limit_settings")
            try {
              const p = JSON.parse(v.content);
              i.value = p.temp_upper, d.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, console.log("Sensor Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse sensor settings data:", p);
            }
          else if (v && v.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), c();
          else if (v && v.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", v.content);
            const h = JSON.parse(v.content).args;
            i.value = h.temp_upper, d.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, c();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const a = (g, v) => {
      const p = g === "tempUpper" ? i : g === "tempLower" ? d : g === "humidityUpper" ? e : n;
      p.value = (p.value || 0) + v, g.startsWith("temp") ? u(g === "tempUpper" ? "upper" : "lower") : s(g === "humidityUpper" ? "upper" : "lower");
    }, u = (g) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), g === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), c();
    }, s = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), c();
    }, c = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), X.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Y("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (g) => {
      r.value = g, o.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? i.value : d.value : g === "humidityUpper" ? e.value : n.value;
    }, f = (g) => {
      const v = parseFloat(g);
      isNaN(v) || (r.value === "tempUpper" ? (i.value = v, u("upper")) : r.value === "tempLower" ? (d.value = v, u("lower")) : r.value === "humidityUpper" ? (e.value = v, s("upper")) : r.value === "humidityLower" && (n.value = v, s("lower"))), r.value = null;
    };
    return (g, v) => (xe(), ke("div", qt, [
      _("div", Kt, [
        v[15] || (v[15] = _("h2", null, "温度设置 (°C)", -1)),
        _("div", zt, [
          v[13] || (v[13] = _("span", { class: "setting-label" }, "上限：", -1)),
          _("div", Qt, [
            _("button", {
              onClick: v[0] || (v[0] = (p) => a("tempUpper", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: i.value,
              onFocus: v[1] || (v[1] = (p) => l("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            _("button", {
              onClick: v[2] || (v[2] = (p) => a("tempUpper", 1))
            }, "+")
          ])
        ]),
        _("div", Gt, [
          v[14] || (v[14] = _("span", { class: "setting-label" }, "下限：", -1)),
          _("div", Jt, [
            _("button", {
              onClick: v[3] || (v[3] = (p) => a("tempLower", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: d.value,
              onFocus: v[4] || (v[4] = (p) => l("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            _("button", {
              onClick: v[5] || (v[5] = (p) => a("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      _("div", Xt, [
        v[18] || (v[18] = _("h2", null, "湿度设置 (%)", -1)),
        _("div", Zt, [
          v[16] || (v[16] = _("span", { class: "setting-label" }, "上限：", -1)),
          _("div", en, [
            _("button", {
              onClick: v[6] || (v[6] = (p) => a("humidityUpper", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: e.value,
              onFocus: v[7] || (v[7] = (p) => l("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            _("button", {
              onClick: v[8] || (v[8] = (p) => a("humidityUpper", 1))
            }, "+")
          ])
        ]),
        _("div", nn, [
          v[17] || (v[17] = _("span", { class: "setting-label" }, "下限：", -1)),
          _("div", on, [
            _("button", {
              onClick: v[9] || (v[9] = (p) => a("humidityLower", -1))
            }, "-"),
            _("input", {
              type: "text",
              value: n.value,
              onFocus: v[10] || (v[10] = (p) => l("humidityLower")),
              readonly: ""
            }, null, 40, rn),
            _("button", {
              onClick: v[11] || (v[11] = (p) => a("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      ze(pt, {
        modelValue: t.value,
        showKeyboard: o.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": v[12] || (v[12] = (p) => o.value = p)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, sn = /* @__PURE__ */ ut(an, [["__scopeId", "data-v-c66c99de"]]), un = {
  key: 0,
  class: "numeric-keyboard"
}, ln = { class: "keyboard" }, cn = { class: "current-value" }, dn = ["onClick"], fn = {
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
  setup(be, { emit: Y }) {
    const X = be, i = Y, d = V([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = V("");
    et(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : o === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : o === "." && e.value.includes(".") || (e.value += o);
    };
    return (o, r) => be.showKeyboard ? (xe(), ke("div", un, [
      _("div", ln, [
        _("div", cn, Te(e.value), 1),
        (xe(!0), ke(ot, null, ct(d.value, (t) => (xe(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (xe(!0), ke(ot, null, ct(t, (a) => (xe(), ke("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({
              "function-key": ["清除", "确定"].includes(a),
              "operator-key": a === "-"
            })
          }, Te(a), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, pn = /* @__PURE__ */ ut(fn, [["__scopeId", "data-v-3f49a3dc"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, xn = { class: "sensor-section" }, kn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, Ln = { class: "radio-group" }, An = { class: "input-group" }, Pn = ["placeholder"], Nn = { class: "dialog-actions" }, Rn = {
  __name: "SensorDisplay",
  setup(be) {
    const Y = V({ temperature: {}, humidity: {} }), X = V({
      temperature: {},
      humidity: {}
    }), i = V(null), d = V(!1), e = V("offset"), n = V(""), o = V(!1), { sendToPyQt: r } = Xe();
    dt(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: l } = Xe();
        et(l, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              Y.value = JSON.parse(f.content);
            } catch (g) {
              console.error("Failed to parse sensor data:", g);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const g = JSON.parse(f.content);
              X.value.temperature = g.temperature, X.value.humidity = g.humidity;
            } catch (g) {
              console.error("Failed to parse adjustments data:", g);
            }
          else f && f.type === "get_sensor_data" ? r("update_remote_sensor_data", Y.value) : f && f.type === "sensor_debug_mode" && (o.value = JSON.parse(f.content));
        });
      } else
        console.log("在普通网页环境中执行"), t(), setInterval(t, 5e3);
    });
    const t = async () => {
      try {
        const l = await fetch("http://localhost:8000/api/sensor-data/");
        if (!l.ok)
          throw new Error(`HTTP error! status: ${l.status}`);
        const f = await l.json();
        Y.value = f;
      } catch (l) {
        console.error("Error fetching sensor data:", l);
      }
    }, a = V(!1), u = V(""), s = (l, f) => {
      i.value = f, n.value = l;
      const g = X.value[l][f];
      g ? (e.value = g.type, u.value = String(g.value)) : (e.value = "offset", u.value = ""), d.value = !0, a.value = !1;
    }, c = async () => {
      try {
        const l = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(u.value) || 0
        };
        X.value[n.value] || (X.value[n.value] = {}), X.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(u.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", l), d.value = !1, u.value = "", a.value = !1;
      } catch (l) {
        console.error("Error applying adjustment:", l);
      }
    };
    return (l, f) => (xe(), ke("div", vn, [
      _("div", hn, [
        f[7] || (f[7] = _("h2", null, "温度传感器【温感1与温感2为温湿度传感器温度数据，温感3与温感4分别为左侧水箱、右侧水箱温度数据】", -1)),
        _("div", mn, [
          _("div", gn, [
            (xe(!0), ke(ot, null, ct(Y.value.temperature, (g, v) => (xe(), ke("div", {
              key: v,
              class: "sensor-card",
              onClick: (p) => o.value ? s("temperature", v) : null
            }, [
              _("div", bn, Te(v), 1),
              _("div", wn, Te(g), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      _("div", xn, [
        f[8] || (f[8] = _("h2", null, "湿度传感器【湿感1与湿感2分别为左侧、右侧湿度数据】", -1)),
        _("div", kn, [
          _("div", _n, [
            (xe(!0), ke(ot, null, ct(Y.value.humidity, (g, v) => (xe(), ke("div", {
              key: v,
              class: "sensor-card",
              onClick: (p) => o.value ? s("humidity", v) : null
            }, [
              _("div", On, Te(v), 1),
              _("div", jn, Te(g), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (xe(), ke("div", En, [
        _("div", Cn, [
          _("h3", null, "调整传感器: " + Te(i.value), 1),
          _("div", Tn, [
            _("div", Ln, [
              _("label", null, [
                lt(_("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (g) => e.value = g),
                  value: "offset"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[9] || (f[9] = ft(" 调整偏移值 "))
              ]),
              _("label", null, [
                lt(_("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (g) => e.value = g),
                  value: "value"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[10] || (f[10] = ft(" 直接设置值 "))
              ])
            ]),
            _("div", An, [
              lt(_("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (g) => u.value = g),
                readonly: "",
                onClick: f[3] || (f[3] = (g) => a.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Pn), [
                [ht, u.value]
              ])
            ])
          ]),
          _("div", Nn, [
            _("button", {
              onClick: f[4] || (f[4] = (g) => d.value = !1)
            }, "取消"),
            _("button", {
              onClick: c,
              class: "primary"
            }, "确定")
          ])
        ]),
        ze(pn, {
          modelValue: u.value,
          "onUpdate:modelValue": f[5] || (f[5] = (g) => u.value = g),
          showKeyboard: a.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (g) => a.value = g)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : st("", !0)
    ]));
  }
}, $n = /* @__PURE__ */ ut(Rn, [["__scopeId", "data-v-eb6c9c13"]]), Bn = { class: "cart-system" }, In = { class: "mode-group" }, Un = { class: "mode-group-left" }, Dn = ["disabled"], Fn = ["disabled"], Mn = { class: "mode-content" }, Vn = { key: 0 }, Wn = { class: "spray-systems" }, qn = { class: "spray-system" }, Kn = { class: "controls" }, zn = { class: "input-group" }, Qn = { class: "input-group" }, Hn = { class: "button-group" }, Gn = ["disabled"], Jn = ["disabled"], Yn = { class: "visualization" }, Xn = { class: "progress-bar" }, Zn = { class: "status" }, eo = {
  key: 1,
  class: "auto-mode-container"
}, to = { class: "auto-mode-title" }, no = { class: "auto-mode-title" }, oo = {
  __name: "CartSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const Y = V("semi-auto"), X = V("both-side"), i = V(30), d = V(30), e = V(i.value), n = V(d.value), o = V(i.value), r = V(d.value), t = V(!1), a = V(0), u = V("喷雾系统就绪"), s = V(!1), c = V(!1), l = V(0);
    let f = null;
    const g = V(30), v = V(30), p = V(g.value), h = V(v.value), m = V(g.value), y = V(v.value), O = V(!1), C = V(0), x = V("右侧喷雾系统就绪"), w = V(!1), b = V(!1), E = V(0);
    let j = null;
    const L = V("喷雾尚未工作"), S = V("喷雾尚未工作"), I = V(!1), W = V(!1), Z = V(!1), ae = V(0), J = V("未知"), q = V(!1), U = V("未知"), A = V(!1), { sendToPyQt: T } = Xe(), K = gt({
      isPyQtWebEngine: !1
    }), ne = vt(() => Y.value === "auto" && q.value === !1 ? `左侧湿度: ${J.value}%` : Y.value === "auto" && q.value === !0 ? `左侧湿度: ${J.value}, 无法使用自动模式, 请检查异常传感器` : " "), M = vt(() => Y.value === "auto" && A.value === !1 ? `右侧湿度: ${U.value}%` : Y.value === "auto" && A.value === !0 ? `右侧湿度: ${U.value}, 无法使用自动模式, 请检查异常传感器` : " ");
    dt(() => {
      if (K.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, K.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: ie } = Xe();
        et(ie, (D) => {
          if (D && D.type === "update_dolly_settings")
            try {
              const G = JSON.parse(D.content);
              (G.side === "left" || !G.side) && (e.value = G.dolly_single_run_time, n.value = G.dolly_run_interval_time, o.value = e.value, r.value = n.value), (G.side === "right" || !G.side) && (p.value = G.dolly_single_run_time, h.value = G.dolly_run_interval_time, m.value = p.value, y.value = h.value), console.log("dolly Settings updated:", G);
            } catch (G) {
              console.error("Failed to parse dolly settings data:", G);
            }
          else if (D && D.type === "update_dolly_state")
            D.content ? $e("喷雾正在运行") : $e("喷雾尚未工作");
          else if (D && D.type === "update_dolly2_state")
            D.content ? Ce("喷雾正在运行") : Ce("喷雾尚未工作");
          else if (D && D.type === "update_water_tank_status")
            try {
              const G = JSON.parse(D.content);
              G.side === "left" ? W.value = G.low_water : G.side === "right" && (Z.value = G.low_water), W.value || Z.value ? (I.value = !0, Y.value === "auto" ? Ae("semi-auto") : ($(), F())) : I.value = !1, console.log("Water tank status updated:", G);
            } catch (G) {
              console.error("Failed to parse water tank status data:", G);
            }
          else if (D && D.type === "CartSystem_init")
            console.log("Received CartSystem_init message"), Se();
          else if (D && D.type === "CartSystem_set") {
            console.log("Received CartSystem_set message:", D.content);
            const G = JSON.parse(D.content);
            if (G.method === "setMode")
              Ae(G.args.newMode);
            else if (G.method === "startSystem")
              G.args && G.args.side === "left" ? R() : (G.args && G.args.side === "right" || R(), ee());
            else if (G.method === "stopSystem")
              G.args && G.args.side === "left" ? $() : (G.args && G.args.side === "right" || $(), F());
            else if (G.method === "updateDollySettings") {
              const Pe = G.args;
              Pe.side === "left" ? (e.value = Pe.dolly_single_run_time, n.value = Pe.dolly_run_interval_time, o.value = e.value, r.value = n.value, Ke("left")) : Pe.side === "right" ? (p.value = Pe.dolly_single_run_time, h.value = Pe.dolly_run_interval_time, m.value = p.value, y.value = h.value, Ke("right")) : (e.value = p.value = Pe.dolly_single_run_time, n.value = h.value = Pe.dolly_run_interval_time, o.value = m.value = e.value, r.value = y.value = n.value, Ke()), console.log("dolly Settings received:", Pe);
            } else G.method === "setTankMode" && Ue(G.args.newMode);
          } else if (D && D.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", D.content);
            const G = JSON.parse(D.content);
            G.type === "humidity1" ? G.value !== -1 ? (J.value = String(G.value), q.value = !1) : (q.value = !0, J.value = "未知") : G.type === "humidity2" && (G.value !== -1 ? (U.value = String(G.value), A.value = !1) : (A.value = !0, U.value = "未知"));
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const Se = () => {
      const ie = {
        mode: Y.value,
        // 左侧喷雾系统
        currentLeftRunTime: i.value,
        currentLeftIntervalTime: d.value,
        tempLeftRunTime: e.value,
        tempLeftIntervalTime: n.value,
        nextLeftRunTime: o.value,
        nextLeftIntervalTime: r.value,
        isLeftRunning: t.value,
        leftProgress: a.value,
        leftStatusMessage: u.value,
        // 右侧喷雾系统
        currentRightRunTime: g.value,
        currentRightIntervalTime: v.value,
        tempRightRunTime: p.value,
        tempRightIntervalTime: h.value,
        nextRightRunTime: m.value,
        nextRightIntervalTime: y.value,
        isRightRunning: O.value,
        rightProgress: C.value,
        rightStatusMessage: x.value,
        // 通用状态
        autoModeStatus: L.value,
        low_water: I.value,
        leftTankLowWater: W.value,
        rightTankLowWater: Z.value,
        phaseStartTime: ae.value,
        tankmode: X.value
      };
      console.log("Sending initial cart system state:", ie), T("CartSystem_init_response", ie);
    }, ve = be;
    et(() => ve.message, (ie) => {
      ie != null && ie.content && (Y.value === "auto" ? Ae("semi-auto") : ($(), F()));
    });
    const Ue = (ie) => {
      X.value = ie, ie === "one-side" ? T("controlDolly", { target: "setTankMode", mode: "one-side" }) : T("controlDolly", { target: "setTankMode", mode: "both-side" });
    }, Ae = (ie) => {
      Y.value = ie, K.isPyQtWebEngine && (ie === "auto" ? ($(), F(), T("controlDolly", { target: "setMode", mode: "auto" })) : (te("left"), te("right"), $e("喷雾尚未工作"), Ce("喷雾尚未工作"), T("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, Fe = () => {
      e.value = Math.max(1, parseInt(e.value) || 1), o.value = e.value, Ke("left");
    }, Ne = () => {
      n.value = Math.max(0, parseInt(n.value) || 0), r.value = n.value, Ke("left");
    }, Re = () => {
      p.value = Math.max(1, parseInt(p.value) || 1), m.value = p.value, Ke("right");
    }, He = () => {
      h.value = Math.max(0, parseInt(h.value) || 0), y.value = h.value, Ke("right");
    };
    function Ke(ie = null) {
      if (K.isPyQtWebEngine)
        if (console.log("在PyQt QWebEngine环境中执行更新设置"), ie === "left") {
          const D = {
            target: "dolly_settings",
            side: "left",
            dolly_single_run_time: o.value,
            dolly_run_interval_time: r.value
          };
          T("controlDolly", D);
        } else if (ie === "right") {
          const D = {
            target: "dolly_settings",
            side: "right",
            dolly_single_run_time: m.value,
            dolly_run_interval_time: y.value
          };
          T("controlDolly", D);
        } else {
          const D = {
            target: "dolly_settings",
            dolly_single_run_time: o.value,
            dolly_run_interval_time: r.value
          };
          T("controlDolly", D);
        }
      else
        console.log("在普通网页环境中执行更新设置");
    }
    const R = () => {
      t.value = !0, he();
    }, $ = () => {
      te("left"), te("right"), t.value = !1, cancelAnimationFrame(f), a.value = 0, u.value = "喷雾系统就绪";
    }, ee = () => {
      O.value = !0, _e();
    }, F = () => {
      te("right"), O.value = !1, cancelAnimationFrame(j), C.value = 0, x.value = "右侧喷雾系统就绪";
    };
    function te(ie = null) {
      if (K.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行停止喷雾");
        const D = {
          target: "setState",
          dolly_state: !1
        };
        ie && (D.side = ie), T("controlDolly", D);
      } else
        console.log("在普通网页环境中执行停止喷雾");
    }
    function re(ie = null) {
      if (K.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行临时停止喷雾");
        const D = {
          target: "setState",
          dolly_state: !1
        };
        ie && (D.side = ie), T("tempControlDolly", D);
      } else
        console.log("在普通网页环境中执行临时停止喷雾");
    }
    function we(ie = null) {
      if (K.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行开始喷雾");
        const D = {
          target: "setState",
          dolly_state: !0
        };
        ie && (D.side = ie), T("controlDolly", D);
      } else
        console.log("在普通网页环境中执行开始喷雾");
    }
    const he = () => {
      we("left"), we("right"), u.value = "喷雾运行中", a.value = 0;
      const ie = Date.now();
      l.value = ie, i.value = o.value;
      const D = () => {
        const G = (Date.now() - ie) / 1e3, Pe = Math.max(0, i.value - G);
        a.value = G / i.value * 100, u.value = `喷雾运行中: 剩余 ${Pe.toFixed(1)} 秒`, G < i.value && t.value ? f = requestAnimationFrame(D) : t.value && (a.value = 100, r.value > 0 && (re("left"), re("right")), ce());
      };
      f = requestAnimationFrame(D);
    }, ce = () => {
      u.value = "等待下次运行";
      const ie = Date.now();
      l.value = ie, d.value = r.value;
      const D = () => {
        const G = (Date.now() - ie) / 1e3, Pe = Math.max(0, d.value - G);
        u.value = `等待下次运行: ${Pe.toFixed(1)}秒`, Pe > 0 && t.value ? f = requestAnimationFrame(D) : t.value && he();
      };
      f = requestAnimationFrame(D);
    }, _e = () => {
      we("right"), x.value = "右侧喷雾运行中", C.value = 0;
      const ie = Date.now();
      E.value = ie, g.value = m.value;
      const D = () => {
        const G = (Date.now() - ie) / 1e3, Pe = Math.max(0, g.value - G);
        C.value = G / g.value * 100, x.value = `右侧喷雾运行中: 剩余 ${Pe.toFixed(1)} 秒`, G < g.value && O.value ? j = requestAnimationFrame(D) : O.value && (C.value = 100, y.value > 0 && re("right"), Oe());
      };
      j = requestAnimationFrame(D);
    }, Oe = () => {
      x.value = "等待右侧下次运行";
      const ie = Date.now();
      E.value = ie, v.value = y.value;
      const D = () => {
        const G = (Date.now() - ie) / 1e3, Pe = Math.max(0, v.value - G);
        x.value = `等待右侧下次运行: ${Pe.toFixed(1)}秒`, Pe > 0 && O.value ? j = requestAnimationFrame(D) : O.value && _e();
      };
      j = requestAnimationFrame(D);
    }, $e = (ie) => {
      L.value = ie;
    }, Ce = (ie) => {
      S.value = ie;
    };
    return _t(() => {
      cancelAnimationFrame(f), cancelAnimationFrame(j);
    }), (ie, D) => (xe(), ke(ot, null, [
      D[17] || (D[17] = _("h2", null, " 喷雾系统 ", -1)),
      D[18] || (D[18] = _("div", { class: "label-box" }, [
        _("label", null, "输出：output3控制左侧喷雾，output4控制右侧喷雾，output5/6控制小车"),
        _("br"),
        _("label", null, "自动模式下，当湿度低于设置的湿度下限时，喷雾开启；当湿度高于设置的湿度上限时，喷雾关闭【当有小车时，有一侧喷雾启动，小车即启动，两侧喷雾均关闭，小车才停止】"),
        _("br")
      ], -1)),
      _("div", Bn, [
        _("div", In, [
          _("div", Un, [
            _("button", {
              class: nt(["mode-button", { active: Y.value === "semi-auto" && !I.value }]),
              disabled: I.value,
              onClick: D[0] || (D[0] = (G) => Y.value === "auto" ? Ae("semi-auto") : () => {
              })
            }, "半自动模式", 10, Dn),
            _("button", {
              class: nt(["mode-button", { active: Y.value === "auto" && !I.value }]),
              disabled: I.value,
              onClick: D[1] || (D[1] = (G) => Y.value === "semi-auto" ? Ae("auto") : () => {
              })
            }, "自动模式", 10, Fn)
          ])
        ]),
        _("div", Mn, [
          Y.value === "semi-auto" ? (xe(), ke("div", Vn, [
            _("div", Wn, [
              _("div", qn, [
                D[15] || (D[15] = _("h3", null, "双侧定时喷雾系统", -1)),
                _("div", Kn, [
                  _("div", zn, [
                    D[12] || (D[12] = _("label", null, "喷雾运行时间 (秒):", -1)),
                    _("div", {
                      class: "input-wrapper",
                      onClick: D[2] || (D[2] = (G) => s.value = !0)
                    }, Te(e.value), 1)
                  ]),
                  _("div", Qn, [
                    D[13] || (D[13] = _("label", null, "喷雾暂停时间 (秒):", -1)),
                    _("div", {
                      class: "input-wrapper",
                      onClick: D[3] || (D[3] = (G) => c.value = !0)
                    }, Te(n.value), 1)
                  ]),
                  _("div", Hn, [
                    _("button", {
                      onClick: R,
                      disabled: t.value || I.value
                    }, "开始", 8, Gn),
                    _("button", {
                      onClick: $,
                      disabled: !t.value || I.value
                    }, "停止", 8, Jn)
                  ])
                ]),
                _("div", Yn, [
                  _("div", Xn, [
                    _("div", {
                      class: "progress",
                      style: kt({ width: a.value + "%" })
                    }, null, 4),
                    _("div", {
                      class: "cart",
                      style: kt({ left: a.value + "%" })
                    }, D[14] || (D[14] = [
                      _("span", { class: "cart-icon" }, "🚜", -1)
                    ]), 4)
                  ])
                ]),
                _("div", Zn, Te(u.value), 1)
              ])
            ])
          ])) : (xe(), ke("div", eo, [
            _("div", to, "自动模式左侧喷雾受左侧湿度传感器控制, " + Te(ne.value), 1),
            _("div", {
              class: nt(["auto-mode-status", { working: L.value === "喷雾正在运行" }])
            }, " 左侧喷雾：" + Te(L.value), 3),
            _("div", no, "自动模式右侧喷雾受右侧湿度传感器控制, " + Te(M.value), 1),
            _("div", {
              class: nt(["auto-mode-status", { working: S.value === "喷雾正在运行" }])
            }, " 右侧喷雾：" + Te(S.value), 3),
            D[16] || (D[16] = _("div", { class: "auto-mode-placeholder" }, null, -1))
          ]))
        ]),
        ze(pt, {
          modelValue: e.value,
          "onUpdate:modelValue": [
            D[4] || (D[4] = (G) => e.value = G),
            Fe
          ],
          showKeyboard: s.value,
          "onUpdate:showKeyboard": D[5] || (D[5] = (G) => s.value = G)
        }, null, 8, ["modelValue", "showKeyboard"]),
        ze(pt, {
          modelValue: n.value,
          "onUpdate:modelValue": [
            D[6] || (D[6] = (G) => n.value = G),
            Ne
          ],
          showKeyboard: c.value,
          "onUpdate:showKeyboard": D[7] || (D[7] = (G) => c.value = G)
        }, null, 8, ["modelValue", "showKeyboard"]),
        ze(pt, {
          modelValue: p.value,
          "onUpdate:modelValue": [
            D[8] || (D[8] = (G) => p.value = G),
            Re
          ],
          showKeyboard: w.value,
          "onUpdate:showKeyboard": D[9] || (D[9] = (G) => w.value = G)
        }, null, 8, ["modelValue", "showKeyboard"]),
        ze(pt, {
          modelValue: h.value,
          "onUpdate:modelValue": [
            D[10] || (D[10] = (G) => h.value = G),
            He
          ],
          showKeyboard: b.value,
          "onUpdate:showKeyboard": D[11] || (D[11] = (G) => b.value = G)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])
    ], 64));
  }
}, ro = /* @__PURE__ */ ut(oo, [["__scopeId", "data-v-e19b9e31"]]), io = { class: "mode-controls" }, ao = { class: "btn-group" }, so = { class: "steam_engine" }, uo = ["disabled"], lo = { class: "steam_engine" }, co = ["disabled"], fo = { class: "text_status" }, po = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const Y = V(!1), X = V(!1), i = V(!1), d = V(!1), e = V(!1), { sendToPyQt: n } = Xe(), o = gt({
      isPyQtWebEngine: !1
    }), r = be;
    et(() => r.message, (v) => {
      v != null && v.content && (i.value ? s("manual") : s("auto"));
    }), dt(() => {
      if (o.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, o.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: v } = Xe();
        et(v, (p) => {
          if (p && p.type === "update_heat_engine_status")
            Y.value = p.content;
          else if (p && p.type === "update_heat_engine2_status")
            X.value = p.content;
          else if (p && p.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", p.content);
            const h = JSON.parse(p.content);
            h.type === "temp1" ? h.value !== -1 ? (t.value = String(h.value), d.value = !1) : (d.value = !0, t.value = "未知") : h.type === "temp2" && (h.value !== -1 ? (a.value = String(h.value), e.value = !1) : (e.value = !0, a.value = "未知"));
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const t = V("未知"), a = V("未知"), u = vt(() => {
      if (!i.value) return "手动模式";
      if (d.value === !1 && e.value === !1) return `自动模式受水下传感器温度控制, 左侧水箱温度: ${t.value}°C, 右侧水箱温度: ${a.value}°C`;
      if (d.value === !0 && e.value === !1) return `自动模式受水下传感器温度控制, 左侧水箱温度: ${t.value}°C, 右侧水箱温度: ${a.value}°C, 左侧水箱传感器异常`;
      if (d.value === !1 && e.value === !0) return `自动模式受水下传感器温度控制, 左侧水箱温度: ${t.value}°C, 右侧水箱温度: ${a.value}°C, 右侧水箱传感器异常`;
      if (d.value === !0 && e.value === !0) return `自动模式受水下传感器温度控制, 左侧水箱温度: ${t.value}°C, 右侧水箱温度: ${a.value}°C, 左侧水箱和右侧水箱传感器异常`;
    });
    async function s(v) {
      const p = i.value;
      i.value = v === "auto", p !== i.value && (o.isPyQtWebEngine && n("controlSprinkler", { target: "setMode", mode: i.value ? "auto" : "manual" }), i.value ? (Y.value && await c(), X.value && await l()) : (Y.value && await c(), X.value && await l()));
    }
    async function c() {
      o.isPyQtWebEngine && (n("setEngineState", { engine: "heatEngine", state: !Y.value }), Y.value = !Y.value);
    }
    async function l() {
      o.isPyQtWebEngine && (n("setEngineState", { engine: "heatEngine2", state: !X.value }), X.value = !X.value);
    }
    async function f() {
      n("setEngineState", { engine: "heatEngine", state: !Y.value }), Y.value = !Y.value;
    }
    async function g() {
      n("setEngineState", { engine: "heatEngine2", state: !X.value }), X.value = !X.value;
    }
    return (v, p) => (xe(), ke(ot, null, [
      p[6] || (p[6] = _("h2", null, "水箱加热系统", -1)),
      p[7] || (p[7] = _("div", { class: "label-box" }, [
        _("label", null, "输出：output1控制左侧水箱加热，output2控制右侧水箱加热"),
        _("br"),
        _("label", null, "自动模式下，当水箱温度低于设置的温度下限时，加热开启；当水箱温度高于设置的温度上限时，加热关闭"),
        _("br")
      ], -1)),
      _("div", io, [
        _("div", ao, [
          _("button", {
            onClick: p[0] || (p[0] = (h) => s("manual")),
            class: nt([{ active: !i.value }, "mode-btn"])
          }, "手动模式", 2),
          _("button", {
            onClick: p[1] || (p[1] = (h) => s("auto")),
            class: nt([{ active: i.value }, "mode-btn"])
          }, "自动模式", 2)
        ])
      ]),
      _("div", so, [
        p[3] || (p[3] = _("h3", null, "左侧水箱加热", -1)),
        _("div", {
          class: nt(["status", { on: Y.value }])
        }, [
          p[2] || (p[2] = _("div", { class: "status-indicator" }, null, -1)),
          ft(" " + Te(Y.value ? "开" : "关"), 1)
        ], 2),
        _("button", {
          onClick: f,
          disabled: i.value,
          class: "control-btn"
        }, Te(Y.value ? "关闭" : "开启"), 9, uo)
      ]),
      _("div", lo, [
        p[5] || (p[5] = _("h3", null, "右侧水箱加热", -1)),
        _("div", {
          class: nt(["status", { on: X.value }])
        }, [
          p[4] || (p[4] = _("div", { class: "status-indicator" }, null, -1)),
          ft(" " + Te(X.value ? "开" : "关"), 1)
        ], 2),
        _("button", {
          onClick: g,
          disabled: i.value,
          class: "control-btn"
        }, Te(X.value ? "关闭" : "开启"), 9, co)
      ]),
      _("div", fo, Te(u.value), 1)
    ], 64));
  }
}, vo = /* @__PURE__ */ ut(po, [["__scopeId", "data-v-54e4a3ba"]]), ho = { class: "data-actions" }, mo = {
  key: 0,
  class: "modal-overlay"
}, go = { class: "modal-content settings-modal" }, yo = { class: "setting-group" }, bo = { class: "setting-item" }, wo = { class: "toggle-switch" }, xo = {
  key: 1,
  class: "modal-overlay"
}, ko = {
  key: 2,
  class: "modal-overlay"
}, _o = { class: "modal-content update-modal" }, So = {
  key: 3,
  class: "modal-overlay"
}, Oo = { class: "modal-content" }, jo = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: Y } = Xe(), X = gt({
      isPyQtWebEngine: !1
    }), i = V(!1), d = V(!1), e = V(""), n = V(!1), o = V(!1), r = V(!1), t = V(!1), a = V(""), u = V(!1), s = () => {
      t.value = !0, a.value = "", document.body.style.overflow = "hidden";
    }, c = () => {
      if (!a.value) {
        O("请输入更新版号！");
        return;
      }
      X.isPyQtWebEngine && Y("updateVersion", { version: a.value }), t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, l = () => {
      t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      r.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, g = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, v = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto", X.isPyQtWebEngine && Y("saveDebugSettings", { debug_mode: o.value });
    };
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: x } = Xe();
        et(x, (w) => {
          if (w && w.type === "update_debug_mode")
            try {
              const b = JSON.parse(w.content);
              o.value = b.debug_mode, r.value = b.debug_mode;
            } catch (b) {
              console.error("Failed to parse debug settings:", b);
            }
          else if (w && w.type === "DataExport_init") {
            const b = {
              debugMode: o.value
            };
            console.log("Sending initial DataExport state:", b), Y("DataExport_init_response", b);
          } else if (w && w.type === "clearData")
            Y("exportData", !1), Y("clearData_response", "");
          else if (w && w.type === "updateVersion_response")
            try {
              const b = JSON.parse(w.content);
              b.status === "success" ? O(`${b.message}，系统即将重启...`) : O(b.message);
            } catch (b) {
              O("解析更新响应失败：" + b);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const p = () => {
      X.isPyQtWebEngine && (console.log("导出数据"), Y("exportData", !0));
    }, h = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, m = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, y = () => {
      console.log("清空数据"), i.value = !1, O("所有数据已清空！"), document.body.style.overflow = "auto", X.isPyQtWebEngine && Y("exportData", !1);
    }, O = (x) => {
      e.value = x, d.value = !0;
    }, C = () => {
      d.value = !1;
    };
    return (x, w) => (xe(), ke("div", ho, [
      _("div", { class: "action-buttons" }, [
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: p,
            class: "export-btn"
          }, "导出数据")
        ]),
        _("div", { class: "button-group" }, [
          _("button", {
            onClick: h,
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
      n.value ? (xe(), ke("div", mo, [
        _("div", go, [
          _("div", yo, [
            w[7] || (w[7] = _("h2", null, "传感器调试模式【开发者测试用】", -1)),
            _("div", bo, [
              w[6] || (w[6] = _("span", { class: "setting-label" }, "调试模式：", -1)),
              _("div", wo, [
                lt(_("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": w[0] || (w[0] = (b) => r.value = b)
                }, null, 512), [
                  [Rt, r.value]
                ]),
                w[5] || (w[5] = _("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            _("div", { class: "modal-buttons" }, [
              _("button", {
                onClick: v,
                class: "confirm-btn"
              }, "保存"),
              _("button", {
                onClick: g,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : st("", !0),
      i.value ? (xe(), ke("div", xo, [
        _("div", { class: "modal-content" }, [
          w[8] || (w[8] = _("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: y,
              class: "confirm-btn"
            }, "确定"),
            _("button", {
              onClick: m,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : st("", !0),
      t.value ? (xe(), ke("div", ko, [
        _("div", _o, [
          w[9] || (w[9] = _("h2", null, "更新版本", -1)),
          _("div", {
            class: "update-input",
            onClick: w[2] || (w[2] = (b) => u.value = !0)
          }, [
            lt(_("input", {
              type: "text",
              "onUpdate:modelValue": w[1] || (w[1] = (b) => a.value = b),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [ht, a.value]
            ])
          ]),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: c,
              class: "confirm-btn"
            }, "更新"),
            _("button", {
              onClick: l,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : st("", !0),
      ze(pt, {
        modelValue: a.value,
        "onUpdate:modelValue": w[3] || (w[3] = (b) => a.value = b),
        "show-keyboard": u.value,
        "onUpdate:showKeyboard": w[4] || (w[4] = (b) => u.value = b)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (xe(), ke("div", So, [
        _("div", Oo, [
          _("h2", null, Te(e.value), 1),
          _("div", { class: "modal-buttons" }, [
            _("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, Eo = /* @__PURE__ */ ut(jo, [["__scopeId", "data-v-d87ac98e"]]);
var Co = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function To(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Lt = { exports: {} };
(function(be, Y) {
  (function(X, i) {
    be.exports = i(Nt);
  })(typeof self < "u" ? self : Co, function(X) {
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
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), a = e("c04e"), u = e("5135"), s = e("0cfb"), c = Object.getOwnPropertyDescriptor;
      d.f = n ? c : function(l, f) {
        if (l = t(l), f = a(f, !0), s) try {
          return c(l, f);
        } catch {
        }
        if (u(l, f)) return r(!o.f.call(l, f), l[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), a = e("4a7b");
      function u(s) {
        this.defaults = s, this.interceptors = { request: new r(), response: new r() };
      }
      u.prototype.request = function(s) {
        typeof s == "string" ? (s = arguments[1] || {}, s.url = arguments[0]) : s = s || {}, s = a(this.defaults, s), s.method ? s.method = s.method.toLowerCase() : this.defaults.method ? s.method = this.defaults.method.toLowerCase() : s.method = "get";
        var c = [t, void 0], l = Promise.resolve(s);
        for (this.interceptors.request.forEach(function(f) {
          c.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          c.push(f.fulfilled, f.rejected);
        }); c.length; ) l = l.then(c.shift(), c.shift());
        return l;
      }, u.prototype.getUri = function(s) {
        return s = a(this.defaults, s), o(s.url, s.params, s.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(s) {
        u.prototype[s] = function(c, l) {
          return this.request(a(l || {}, { method: s, url: c, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(s) {
        u.prototype[s] = function(c, l, f) {
          return this.request(a(f || {}, { method: s, url: c, data: l }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, a = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, s, c, l, f, g) {
        var v = c + u.length, p = l.length, h = a;
        return f !== void 0 && (f = n(f), h = t), r.call(g, h, function(m, y) {
          var O;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return s.slice(0, c);
            case "'":
              return s.slice(v);
            case "<":
              O = f[y.slice(1, -1)];
              break;
            default:
              var C = +y;
              if (C === 0) return m;
              if (C > p) {
                var x = o(C / 10);
                return x === 0 ? m : x <= p ? l[x - 1] === void 0 ? y.charAt(1) : l[x - 1] + y.charAt(1) : m;
              }
              O = l[C - 1];
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
        var t = String(o(this)), a = "", u = n(r);
        if (u < 0 || u == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (t += t)) 1 & u && (a += t);
        return a;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), a = e("4840"), u = e("8aa5"), s = e("50c4"), c = e("14c3"), l = e("9263"), f = e("d039"), g = [].push, v = Math.min, p = 4294967295, h = !f(function() {
        return !RegExp(p, "y");
      });
      n("split", 2, function(m, y, O) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, w) {
          var b = String(t(this)), E = w === void 0 ? p : w >>> 0;
          if (E === 0) return [];
          if (x === void 0) return [b];
          if (!o(x)) return y.call(b, x, E);
          for (var j, L, S, I = [], W = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), Z = 0, ae = new RegExp(x.source, W + "g"); (j = l.call(ae, b)) && (L = ae.lastIndex, !(L > Z && (I.push(b.slice(Z, j.index)), j.length > 1 && j.index < b.length && g.apply(I, j.slice(1)), S = j[0].length, Z = L, I.length >= E))); )
            ae.lastIndex === j.index && ae.lastIndex++;
          return Z === b.length ? !S && ae.test("") || I.push("") : I.push(b.slice(Z)), I.length > E ? I.slice(0, E) : I;
        } : "0".split(void 0, 0).length ? function(x, w) {
          return x === void 0 && w === 0 ? [] : y.call(this, x, w);
        } : y, [function(x, w) {
          var b = t(this), E = x == null ? void 0 : x[m];
          return E !== void 0 ? E.call(x, b, w) : C.call(String(b), x, w);
        }, function(x, w) {
          var b = O(C, x, this, w, C !== y);
          if (b.done) return b.value;
          var E = r(x), j = String(this), L = a(E, RegExp), S = E.unicode, I = (E.ignoreCase ? "i" : "") + (E.multiline ? "m" : "") + (E.unicode ? "u" : "") + (h ? "y" : "g"), W = new L(h ? E : "^(?:" + E.source + ")", I), Z = w === void 0 ? p : w >>> 0;
          if (Z === 0) return [];
          if (j.length === 0) return c(W, j) === null ? [j] : [];
          for (var ae = 0, J = 0, q = []; J < j.length; ) {
            W.lastIndex = h ? J : 0;
            var U, A = c(W, h ? j : j.slice(J));
            if (A === null || (U = v(s(W.lastIndex + (h ? 0 : J)), j.length)) === ae) J = u(j, J, S);
            else {
              if (q.push(j.slice(ae, J)), q.length === Z) return q;
              for (var T = 1; T <= A.length - 1; T++) if (q.push(A[T]), q.length === Z) return q;
              J = ae = U;
            }
          }
          return q.push(j.slice(ae)), q;
        }];
      }, !h);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), a = e("605d"), u = r("reduce"), s = !a && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || s }, { reduce: function(c) {
        return o(this, c, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
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
        var c = !1;
        try {
          var l = {};
          l[o] = function() {
            return { next: function() {
              return { done: c = !0 };
            } };
          }, u(l);
        } catch {
        }
        return c;
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
          function o(R, $) {
            return $ = { exports: {} }, R($, $.exports), $.exports;
          }
          var r = o(function(R, $) {
            (function(ee, F) {
              R.exports = F();
            })(0, function() {
              function ee(ce) {
                var _e = ce && typeof ce == "object";
                return _e && Object.prototype.toString.call(ce) !== "[object RegExp]" && Object.prototype.toString.call(ce) !== "[object Date]";
              }
              function F(ce) {
                return Array.isArray(ce) ? [] : {};
              }
              function te(ce, _e) {
                var Oe = _e && _e.clone === !0;
                return Oe && ee(ce) ? he(F(ce), ce, _e) : ce;
              }
              function re(ce, _e, Oe) {
                var $e = ce.slice();
                return _e.forEach(function(Ce, ie) {
                  typeof $e[ie] > "u" ? $e[ie] = te(Ce, Oe) : ee(Ce) ? $e[ie] = he(ce[ie], Ce, Oe) : ce.indexOf(Ce) === -1 && $e.push(te(Ce, Oe));
                }), $e;
              }
              function we(ce, _e, Oe) {
                var $e = {};
                return ee(ce) && Object.keys(ce).forEach(function(Ce) {
                  $e[Ce] = te(ce[Ce], Oe);
                }), Object.keys(_e).forEach(function(Ce) {
                  ee(_e[Ce]) && ce[Ce] ? $e[Ce] = he(ce[Ce], _e[Ce], Oe) : $e[Ce] = te(_e[Ce], Oe);
                }), $e;
              }
              function he(ce, _e, Oe) {
                var $e = Array.isArray(_e), Ce = Oe || { arrayMerge: re }, ie = Ce.arrayMerge || re;
                return $e ? Array.isArray(ce) ? ie(ce, _e, Oe) : te(_e, Oe) : we(ce, _e, Oe);
              }
              return he.all = function(ce, _e) {
                if (!Array.isArray(ce) || ce.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ce.reduce(function(Oe, $e) {
                  return he(Oe, $e, _e);
                });
              }, he;
            });
          });
          function t(R) {
            return R = R || /* @__PURE__ */ Object.create(null), { on: function($, ee) {
              (R[$] || (R[$] = [])).push(ee);
            }, off: function($, ee) {
              R[$] && R[$].splice(R[$].indexOf(ee) >>> 0, 1);
            }, emit: function($, ee) {
              (R[$] || []).map(function(F) {
                F(ee);
              }), (R["*"] || []).map(function(F) {
                F($, ee);
              });
            } };
          }
          var a = o(function(R, $) {
            var ee = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            $.default = ee, R.exports = $.default;
          }), u = function(R) {
            return Object.keys(R).map(function($) {
              var ee = R[$].toString().replace(/"/g, "&quot;");
              return $ + '="' + ee + '"';
            }).join(" ");
          }, s = a.svg, c = a.xlink, l = {};
          l[s.name] = s.uri, l[c.name] = c.uri;
          var f, g = function(R, $) {
            R === void 0 && (R = "");
            var ee = r(l, $ || {}), F = u(ee);
            return "<svg " + F + ">" + R + "</svg>";
          }, v = a.svg, p = a.xlink, h = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[v.name] = v.uri, f[p.name] = p.uri, f) }, m = function(R) {
            this.config = r(h, R || {}), this.symbols = [];
          };
          m.prototype.add = function(R) {
            var $ = this, ee = $.symbols, F = this.find(R.id);
            return F ? (ee[ee.indexOf(F)] = R, !1) : (ee.push(R), !0);
          }, m.prototype.remove = function(R) {
            var $ = this, ee = $.symbols, F = this.find(R);
            return !!F && (ee.splice(ee.indexOf(F), 1), F.destroy(), !0);
          }, m.prototype.find = function(R) {
            return this.symbols.filter(function($) {
              return $.id === R;
            })[0] || null;
          }, m.prototype.has = function(R) {
            return this.find(R) !== null;
          }, m.prototype.stringify = function() {
            var R = this.config, $ = R.attrs, ee = this.symbols.map(function(F) {
              return F.stringify();
            }).join("");
            return g(ee, $);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(R) {
              return R.destroy();
            });
          };
          var y = function(R) {
            var $ = R.id, ee = R.viewBox, F = R.content;
            this.id = $, this.viewBox = ee, this.content = F;
          };
          y.prototype.stringify = function() {
            return this.content;
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            var R = this;
            ["id", "viewBox", "content"].forEach(function($) {
              return delete R[$];
            });
          };
          var O = function(R) {
            var $ = !!document.importNode, ee = new DOMParser().parseFromString(R, "image/svg+xml").documentElement;
            return $ ? document.importNode(ee, !0) : ee;
          }, C = function(R) {
            function $() {
              R.apply(this, arguments);
            }
            R && ($.__proto__ = R), $.prototype = Object.create(R && R.prototype), $.prototype.constructor = $;
            var ee = { isMounted: {} };
            return ee.isMounted.get = function() {
              return !!this.node;
            }, $.createFromExistingNode = function(F) {
              return new $({ id: F.getAttribute("id"), viewBox: F.getAttribute("viewBox"), content: F.outerHTML });
            }, $.prototype.destroy = function() {
              this.isMounted && this.unmount(), R.prototype.destroy.call(this);
            }, $.prototype.mount = function(F) {
              if (this.isMounted) return this.node;
              var te = typeof F == "string" ? document.querySelector(F) : F, re = this.render();
              return this.node = re, te.appendChild(re), re;
            }, $.prototype.render = function() {
              var F = this.stringify();
              return O(g(F)).childNodes[0];
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties($.prototype, ee), $;
          }(y), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, w = function(R) {
            return Array.prototype.slice.call(R, 0);
          }, b = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, E = function(R, $) {
            var ee = document.createEvent("CustomEvent");
            ee.initCustomEvent(R, !1, !1, $), window.dispatchEvent(ee);
          }, j = function(R) {
            var $ = [];
            return w(R.querySelectorAll("style")).forEach(function(ee) {
              ee.textContent += "", $.push(ee);
            }), $;
          }, L = function(R) {
            return (R || window.location.href).split("#")[0];
          }, S = function(R) {
            angular.module("ng").run(["$rootScope", function($) {
              $.$on("$locationChangeSuccess", function(ee, F, te) {
                E(R, { oldUrl: te, newUrl: F });
              });
            }]);
          }, I = "linearGradient, radialGradient, pattern, mask, clipPath", W = function(R, $) {
            return $ === void 0 && ($ = I), w(R.querySelectorAll("symbol")).forEach(function(ee) {
              w(ee.querySelectorAll($)).forEach(function(F) {
                ee.parentNode.insertBefore(F, ee);
              });
            }), R;
          };
          function Z(R, $) {
            var ee = w(R).reduce(function(F, te) {
              if (!te.attributes) return F;
              var re = w(te.attributes), we = $ ? re.filter($) : re;
              return F.concat(we);
            }, []);
            return ee;
          }
          var ae = a.xlink.uri, J = "xlink:href", q = /[{}|\\\^\[\]`"<>]/g;
          function U(R) {
            return R.replace(q, function($) {
              return "%" + $[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function A(R) {
            return R.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function T(R, $, ee) {
            return w(R).forEach(function(F) {
              var te = F.getAttribute(J);
              if (te && te.indexOf($) === 0) {
                var re = te.replace($, ee);
                F.setAttributeNS(ae, J, re);
              }
            }), R;
          }
          var K, ne = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], M = ne.map(function(R) {
            return "[" + R + "]";
          }).join(","), Se = function(R, $, ee, F) {
            var te = U(ee), re = U(F), we = R.querySelectorAll(M), he = Z(we, function(ce) {
              var _e = ce.localName, Oe = ce.value;
              return ne.indexOf(_e) !== -1 && Oe.indexOf("url(" + te) !== -1;
            });
            he.forEach(function(ce) {
              return ce.value = ce.value.replace(new RegExp(A(te), "g"), re);
            }), T($, te, re);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ue = function(R) {
            function $(F) {
              var te = this;
              F === void 0 && (F = {}), R.call(this, r(x, F));
              var re = t();
              this._emitter = re, this.node = null;
              var we = this, he = we.config;
              if (he.autoConfigure && this._autoConfigure(F), he.syncUrlsWithBaseTag) {
                var ce = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(ve.MOUNT, function() {
                  return te.updateUrls("#", ce);
                });
              }
              var _e = this._handleLocationChange.bind(this);
              this._handleLocationChange = _e, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, _e), he.locationChangeAngularEmitter && S(he.locationChangeEvent), re.on(ve.MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && W(Oe);
              }), re.on(ve.SYMBOL_MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && W(Oe.parentNode), (b.isIE() || b.isEdge()) && j(Oe);
              });
            }
            R && ($.__proto__ = R), $.prototype = Object.create(R && R.prototype), $.prototype.constructor = $;
            var ee = { isMounted: {} };
            return ee.isMounted.get = function() {
              return !!this.node;
            }, $.prototype._autoConfigure = function(F) {
              var te = this, re = te.config;
              typeof F.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof F.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof F.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = b.isFirefox());
            }, $.prototype._handleLocationChange = function(F) {
              var te = F.detail, re = te.oldUrl, we = te.newUrl;
              this.updateUrls(re, we);
            }, $.prototype.add = function(F) {
              var te = this, re = R.prototype.add.call(this, F);
              return this.isMounted && re && (F.mount(te.node), this._emitter.emit(ve.SYMBOL_MOUNT, F.node)), re;
            }, $.prototype.attach = function(F) {
              var te = this, re = this;
              if (re.isMounted) return re.node;
              var we = typeof F == "string" ? document.querySelector(F) : F;
              return re.node = we, this.symbols.forEach(function(he) {
                he.mount(re.node), te._emitter.emit(ve.SYMBOL_MOUNT, he.node);
              }), w(we.querySelectorAll("symbol")).forEach(function(he) {
                var ce = C.createFromExistingNode(he);
                ce.node = he, re.add(ce);
              }), this._emitter.emit(ve.MOUNT, we), we;
            }, $.prototype.destroy = function() {
              var F = this, te = F.config, re = F.symbols, we = F._emitter;
              re.forEach(function(he) {
                return he.destroy();
              }), we.off("*"), window.removeEventListener(te.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, $.prototype.mount = function(F, te) {
              F === void 0 && (F = this.config.mountTo), te === void 0 && (te = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var we = typeof F == "string" ? document.querySelector(F) : F, he = re.render();
              return this.node = he, te && we.childNodes[0] ? we.insertBefore(he, we.childNodes[0]) : we.appendChild(he), this._emitter.emit(ve.MOUNT, he), he;
            }, $.prototype.render = function() {
              return O(this.stringify());
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, $.prototype.updateUrls = function(F, te) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return Se(this.node, re, L(F) + "#", L(te) + "#"), !0;
            }, Object.defineProperties($.prototype, ee), $;
          }(m), Ae = o(function(R) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function($, ee) {
              R.exports = ee();
            })(0, function() {
              var $, ee = [], F = document, te = F.documentElement.doScroll, re = "DOMContentLoaded", we = (te ? /^loaded|^c/ : /^loaded|^i|^c/).test(F.readyState);
              return we || F.addEventListener(re, $ = function() {
                for (F.removeEventListener(re, $), we = 1; $ = ee.shift(); ) $();
              }), function(he) {
                we ? setTimeout(he, 0) : ee.push(he);
              };
            });
          }), Fe = "__SVG_SPRITE_NODE__", Ne = "__SVG_SPRITE__", Re = !!window[Ne];
          Re ? K = window[Ne] : (K = new Ue({ attrs: { id: Fe, "aria-hidden": "true" } }), window[Ne] = K);
          var He = function() {
            var R = document.getElementById(Fe);
            R ? K.attach(R) : K.mount(document.body, !0);
          };
          document.body ? He() : Ae(He);
          var Ke = K;
          return Ke;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), a = e("35a1"), u = e("2a62"), s = function(c, l) {
        this.stopped = c, this.result = l;
      };
      i.exports = function(c, l, f) {
        var g, v, p, h, m, y, O, C = f && f.that, x = !(!f || !f.AS_ENTRIES), w = !(!f || !f.IS_ITERATOR), b = !(!f || !f.INTERRUPTED), E = t(l, C, 1 + x + b), j = function(S) {
          return g && u(g), new s(!0, S);
        }, L = function(S) {
          return x ? (n(S), b ? E(S[0], S[1], j) : E(S[0], S[1])) : b ? E(S, j) : E(S);
        };
        if (w) g = c;
        else {
          if (v = a(c), typeof v != "function") throw TypeError("Target is not iterable");
          if (o(v)) {
            for (p = 0, h = r(c.length); h > p; p++) if (m = L(c[p]), m && m instanceof s) return m;
            return new s(!1);
          }
          g = v.call(c);
        }
        for (y = g.next; !(O = y.call(g)).done; ) {
          try {
            m = L(O.value);
          } catch (S) {
            throw u(g), S;
          }
          if (typeof m == "object" && m && m instanceof s) return m;
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
      i.exports = function(c, l) {
        var f, g, v, p, h, m, y = c.target, O = c.global, C = c.stat;
        if (g = O ? n : C ? n[y] || a(y, {}) : (n[y] || {}).prototype, g) for (v in l) {
          if (h = l[v], c.noTargetGet ? (m = o(g, v), p = m && m.value) : p = g[v], f = s(O ? v : y + (C ? "." : "#") + v, c.forced), !f && p !== void 0) {
            if (typeof h == typeof p) continue;
            u(h, p);
          }
          (c.sham || p && p.sham) && r(h, "sham", !0), t(g, v, h, c);
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
        function a(c, l) {
          !o.isUndefined(c) && o.isUndefined(c["Content-Type"]) && (c["Content-Type"] = l);
        }
        function u() {
          var c;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (c = e("b50d")), c;
        }
        var s = { adapter: u(), transformRequest: [function(c, l) {
          return r(l, "Accept"), r(l, "Content-Type"), o.isFormData(c) || o.isArrayBuffer(c) || o.isBuffer(c) || o.isStream(c) || o.isFile(c) || o.isBlob(c) ? c : o.isArrayBufferView(c) ? c.buffer : o.isURLSearchParams(c) ? (a(l, "application/x-www-form-urlencoded;charset=utf-8"), c.toString()) : o.isObject(c) ? (a(l, "application/json;charset=utf-8"), JSON.stringify(c)) : c;
        }], transformResponse: [function(c) {
          if (typeof c == "string") try {
            c = JSON.parse(c);
          } catch {
          }
          return c;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(c) {
          return c >= 200 && c < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        o.forEach(["delete", "get", "head"], function(c) {
          s.headers[c] = {};
        }), o.forEach(["post", "put", "patch"], function(c) {
          s.headers[c] = o.merge(t);
        }), i.exports = s;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(a) {
        return !!~String(r(this)).indexOf(o(a), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), a = "toString", u = RegExp.prototype, s = u[a], c = r(function() {
        return s.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = s.name != a;
      (c || l) && n(RegExp.prototype, a, function() {
        var f = o(this), g = String(f.source), v = f.flags, p = String(v === void 0 && f instanceof RegExp && !("flags" in u) ? t.call(f) : v);
        return "/" + g + "/" + p;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), a = r("species");
      i.exports = function(u) {
        var s = n(u), c = o.f;
        t && s && !s[a] && c(s, a, { configurable: !0, get: function() {
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
      var n, o, r, t = e("da84"), a = e("d039"), u = e("0366"), s = e("1be4"), c = e("cc12"), l = e("1cdc"), f = e("605d"), g = t.location, v = t.setImmediate, p = t.clearImmediate, h = t.process, m = t.MessageChannel, y = t.Dispatch, O = 0, C = {}, x = "onreadystatechange", w = function(L) {
        if (C.hasOwnProperty(L)) {
          var S = C[L];
          delete C[L], S();
        }
      }, b = function(L) {
        return function() {
          w(L);
        };
      }, E = function(L) {
        w(L.data);
      }, j = function(L) {
        t.postMessage(L + "", g.protocol + "//" + g.host);
      };
      v && p || (v = function(L) {
        for (var S = [], I = 1; arguments.length > I; ) S.push(arguments[I++]);
        return C[++O] = function() {
          (typeof L == "function" ? L : Function(L)).apply(void 0, S);
        }, n(O), O;
      }, p = function(L) {
        delete C[L];
      }, f ? n = function(L) {
        h.nextTick(b(L));
      } : y && y.now ? n = function(L) {
        y.now(b(L));
      } : m && !l ? (o = new m(), r = o.port2, o.port1.onmessage = E, n = u(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !a(j) ? (n = j, t.addEventListener("message", E, !1)) : n = x in c("script") ? function(L) {
        s.appendChild(c("script"))[x] = function() {
          s.removeChild(this), w(L);
        };
      } : function(L) {
        setTimeout(b(L), 0);
      }), i.exports = { set: v, clear: p };
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
          n.forEach(t, function(l, f) {
            l !== null && typeof l < "u" && (n.isArray(l) ? f += "[]" : l = [l], n.forEach(l, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), s.push(o(f) + "=" + o(g));
            }));
          }), u = s.join("&");
        }
        if (u) {
          var c = r.indexOf("#");
          c !== -1 && (r = r.slice(0, c)), r += (r.indexOf("?") === -1 ? "?" : "&") + u;
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
        for (var s, c = t(u), l = c.length, f = 0; l > f; ) o.f(a, s = c[f++], u[s]);
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
        var s, c = u(this), l = c.string, f = c.index;
        return f >= l.length ? { value: void 0, done: !0 } : (s = n(l, f), c.index += s.length, { value: s, done: !1 });
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
      n("match", 1, function(s, c, l) {
        return [function(f) {
          var g = t(this), v = f == null ? void 0 : f[s];
          return v !== void 0 ? v.call(f, g) : new RegExp(f)[s](String(g));
        }, function(f) {
          var g = l(c, f, this);
          if (g.done) return g.value;
          var v = o(f), p = String(this);
          if (!v.global) return u(v, p);
          var h = v.unicode;
          v.lastIndex = 0;
          for (var m, y = [], O = 0; (m = u(v, p)) !== null; ) {
            var C = String(m[0]);
            y[O] = C, C === "" && (v.lastIndex = a(p, r(v.lastIndex), h)), O++;
          }
          return O === 0 ? null : y;
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
        var s, c = n(a).constructor;
        return c === void 0 || (s = n(c)[t]) == null ? u : o(s);
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
        var t = {}, a = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], s = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], c = ["validateStatus"];
        function l(p, h) {
          return n.isPlainObject(p) && n.isPlainObject(h) ? n.merge(p, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function f(p) {
          n.isUndefined(r[p]) ? n.isUndefined(o[p]) || (t[p] = l(void 0, o[p])) : t[p] = l(o[p], r[p]);
        }
        n.forEach(a, function(p) {
          n.isUndefined(r[p]) || (t[p] = l(void 0, r[p]));
        }), n.forEach(u, f), n.forEach(s, function(p) {
          n.isUndefined(r[p]) ? n.isUndefined(o[p]) || (t[p] = l(void 0, o[p])) : t[p] = l(void 0, r[p]);
        }), n.forEach(c, function(p) {
          p in r ? t[p] = l(o[p], r[p]) : p in o && (t[p] = l(void 0, o[p]));
        });
        var g = a.concat(u).concat(s).concat(c), v = Object.keys(o).concat(Object.keys(r)).filter(function(p) {
          return g.indexOf(p) === -1;
        });
        return n.forEach(v, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), a = e("9bf2").f, u = e("241c").f, s = e("44e7"), c = e("ad6d"), l = e("9f7f"), f = e("6eeb"), g = e("d039"), v = e("69f3").set, p = e("2626"), h = e("b622"), m = h("match"), y = o.RegExp, O = y.prototype, C = /a/g, x = /a/g, w = new y(C) !== C, b = l.UNSUPPORTED_Y, E = n && r("RegExp", !w || b || g(function() {
        return x[m] = !1, y(C) != C || y(x) == x || y(C, "i") != "/a/i";
      }));
      if (E) {
        for (var j = function(W, Z) {
          var ae, J = this instanceof j, q = s(W), U = Z === void 0;
          if (!J && q && W.constructor === j && U) return W;
          w ? q && !U && (W = W.source) : W instanceof j && (U && (Z = c.call(W)), W = W.source), b && (ae = !!Z && Z.indexOf("y") > -1, ae && (Z = Z.replace(/y/g, "")));
          var A = t(w ? new y(W, Z) : y(W, Z), J ? this : O, j);
          return b && ae && v(A, { sticky: ae }), A;
        }, L = function(W) {
          W in j || a(j, W, { configurable: !0, get: function() {
            return y[W];
          }, set: function(Z) {
            y[W] = Z;
          } });
        }, S = u(y), I = 0; S.length > I; ) L(S[I++]);
        O.constructor = j, j.prototype = O, f(o, "RegExp", j);
      }
      p("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(a) {
        return function(u, s, c) {
          var l, f = n(u), g = o(f.length), v = r(c, g);
          if (a && s != s) {
            for (; g > v; ) if (l = f[v++], l != l) return !0;
          } else for (; g > v; v++) if ((a || v in f) && f[v] === s) return a || v || 0;
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
      i.exports = function(c) {
        var l, f, g, v, p, h, m = o(c), y = typeof this == "function" ? this : Array, O = arguments.length, C = O > 1 ? arguments[1] : void 0, x = C !== void 0, w = s(m), b = 0;
        if (x && (C = n(C, O > 2 ? arguments[2] : void 0, 2)), w == null || y == Array && t(w)) for (l = a(m.length), f = new y(l); l > b; b++) h = x ? C(m[b], b) : m[b], u(f, b, h);
        else for (v = w.call(m), p = v.next, f = new y(); !(g = p.call(v)).done; b++) h = x ? r(v, C, [g.value, b], !0) : g.value, u(f, b, h);
        return f.length = b, f;
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
        a(u), u.headers = u.headers || {}, u.data = o(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(c) {
          delete u.headers[c];
        });
        var s = u.adapter || t.adapter;
        return s(u).then(function(c) {
          return a(u), c.data = o(c.data, c.headers, u.transformResponse), c;
        }, function(c) {
          return r(c) || (a(u), c && c.response && (c.response.data = o(c.response.data, c.response.headers, u.transformResponse))), Promise.reject(c);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), a = e("1d80"), u = e("8aa5"), s = e("0cb2"), c = e("14c3"), l = Math.max, f = Math.min, g = function(v) {
        return v === void 0 ? v : String(v);
      };
      n("replace", 2, function(v, p, h, m) {
        var y = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, O = m.REPLACE_KEEPS_$0, C = y ? "$" : "$0";
        return [function(x, w) {
          var b = a(this), E = x == null ? void 0 : x[v];
          return E !== void 0 ? E.call(x, b, w) : p.call(String(b), x, w);
        }, function(x, w) {
          if (!y && O || typeof w == "string" && w.indexOf(C) === -1) {
            var b = h(p, x, this, w);
            if (b.done) return b.value;
          }
          var E = o(x), j = String(this), L = typeof w == "function";
          L || (w = String(w));
          var S = E.global;
          if (S) {
            var I = E.unicode;
            E.lastIndex = 0;
          }
          for (var W = []; ; ) {
            var Z = c(E, j);
            if (Z === null || (W.push(Z), !S)) break;
            var ae = String(Z[0]);
            ae === "" && (E.lastIndex = u(j, r(E.lastIndex), I));
          }
          for (var J = "", q = 0, U = 0; U < W.length; U++) {
            Z = W[U];
            for (var A = String(Z[0]), T = l(f(t(Z.index), j.length), 0), K = [], ne = 1; ne < Z.length; ne++) K.push(g(Z[ne]));
            var M = Z.groups;
            if (L) {
              var Se = [A].concat(K, T, j);
              M !== void 0 && Se.push(M);
              var ve = String(w.apply(void 0, Se));
            } else ve = s(A, j, T, K, M, w);
            T >= q && (J += j.slice(q, T) + ve, q = T + A.length);
          }
          return J + j.slice(q);
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
        var r = n.document, t = r.documentElement, a = r.querySelector('meta[name="viewport"]'), u = r.querySelector('meta[name="flexible"]'), s = 0, c = 0, l = o.flexible || (o.flexible = {});
        if (a) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = a.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (c = parseFloat(f[1]), s = parseInt(1 / c));
        } else if (u) {
          var g = u.getAttribute("content");
          if (g) {
            var v = g.match(/initial\-dpr=([\d\.]+)/), p = g.match(/maximum\-dpr=([\d\.]+)/);
            v && (s = parseFloat(v[1]), c = parseFloat((1 / s).toFixed(2))), p && (s = parseFloat(p[1]), c = parseFloat((1 / s).toFixed(2)));
          }
        }
        if (!s && !c) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          s = h ? m >= 3 && (!s || s >= 3) ? 3 : m >= 2 && (!s || s >= 2) ? 2 : 1 : 1, c = 1 / s;
        }
        if (t.setAttribute("data-dpr", s), !a) if (a = r.createElement("meta"), a.setAttribute("name", "viewport"), a.setAttribute("content", "initial-scale=" + c + ", maximum-scale=" + c + ", minimum-scale=" + c + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(a);
        else {
          var y = r.createElement("div");
          y.appendChild(a), r.write(y.innerHTML);
        }
        function O() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", l.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          O();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && O();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * s + "px" : r.addEventListener("DOMContentLoaded", function(C) {
          r.body.style.fontSize = 10 * s + "px";
        }, !1), O(), l.dpr = n.dpr = s, l.refreshRem = O, l.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, l.px2rem = function(C) {
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
          var s, c, l = String(o(a)), f = n(u), g = l.length;
          return f < 0 || f >= g ? t ? "" : void 0 : (s = l.charCodeAt(f), s < 55296 || s > 56319 || f + 1 === g || (c = l.charCodeAt(f + 1)) < 56320 || c > 57343 ? t ? l.charAt(f) : s : t ? l.slice(f, f + 2) : c - 56320 + (s - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), a = e("19aa"), u = e("2266"), s = e("7dd0"), c = e("2626"), l = e("83ab"), f = e("f183").fastKey, g = e("69f3"), v = g.set, p = g.getterFor;
      i.exports = { getConstructor: function(h, m, y, O) {
        var C = h(function(E, j) {
          a(E, C, m), v(E, { type: m, index: o(null), first: void 0, last: void 0, size: 0 }), l || (E.size = 0), j != null && u(j, E[O], { that: E, AS_ENTRIES: y });
        }), x = p(m), w = function(E, j, L) {
          var S, I, W = x(E), Z = b(E, j);
          return Z ? Z.value = L : (W.last = Z = { index: I = f(j, !0), key: j, value: L, previous: S = W.last, next: void 0, removed: !1 }, W.first || (W.first = Z), S && (S.next = Z), l ? W.size++ : E.size++, I !== "F" && (W.index[I] = Z)), E;
        }, b = function(E, j) {
          var L, S = x(E), I = f(j);
          if (I !== "F") return S.index[I];
          for (L = S.first; L; L = L.next) if (L.key == j) return L;
        };
        return r(C.prototype, { clear: function() {
          for (var E = this, j = x(E), L = j.index, S = j.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete L[S.index], S = S.next;
          j.first = j.last = void 0, l ? j.size = 0 : E.size = 0;
        }, delete: function(E) {
          var j = this, L = x(j), S = b(j, E);
          if (S) {
            var I = S.next, W = S.previous;
            delete L.index[S.index], S.removed = !0, W && (W.next = I), I && (I.previous = W), L.first == S && (L.first = I), L.last == S && (L.last = W), l ? L.size-- : j.size--;
          }
          return !!S;
        }, forEach: function(E) {
          for (var j, L = x(this), S = t(E, arguments.length > 1 ? arguments[1] : void 0, 3); j = j ? j.next : L.first; )
            for (S(j.value, j.key, this); j && j.removed; ) j = j.previous;
        }, has: function(E) {
          return !!b(this, E);
        } }), r(C.prototype, y ? { get: function(E) {
          var j = b(this, E);
          return j && j.value;
        }, set: function(E, j) {
          return w(this, E === 0 ? 0 : E, j);
        } } : { add: function(E) {
          return w(this, E = E === 0 ? 0 : E, E);
        } }), l && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(h, m, y) {
        var O = m + " Iterator", C = p(m), x = p(O);
        s(h, m, function(w, b) {
          v(this, { type: O, target: w, state: C(w), kind: b, last: void 0 });
        }, function() {
          for (var w = x(this), b = w.kind, E = w.last; E && E.removed; ) E = E.previous;
          return w.target && (w.last = E = E ? E.next : w.state.first) ? b == "keys" ? { value: E.key, done: !1 } : b == "values" ? { value: E.value, done: !1 } : { value: [E.key, E.value], done: !1 } : (w.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), c(m);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s;
        return o(a) && (s = a.constructor, typeof s != "function" || s !== Array && !o(s.prototype) ? n(s) && (s = s[t], s === null && (s = void 0)) : s = void 0), new (s === void 0 ? Array : s)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), a = e("da84"), u = e("861d"), s = e("9112"), c = e("5135"), l = e("c6cd"), f = e("f772"), g = e("d012"), v = a.WeakMap, p = function(w) {
        return r(w) ? o(w) : n(w, {});
      }, h = function(w) {
        return function(b) {
          var E;
          if (!u(b) || (E = o(b)).type !== w) throw TypeError("Incompatible receiver, " + w + " required");
          return E;
        };
      };
      if (t) {
        var m = l.state || (l.state = new v()), y = m.get, O = m.has, C = m.set;
        n = function(w, b) {
          return b.facade = w, C.call(m, w, b), b;
        }, o = function(w) {
          return y.call(m, w) || {};
        }, r = function(w) {
          return O.call(m, w);
        };
      } else {
        var x = f("state");
        g[x] = !0, n = function(w, b) {
          return b.facade = w, s(w, x, b), b;
        }, o = function(w) {
          return c(w, x) ? w[x] : {};
        }, r = function(w) {
          return c(w, x);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: p, getterFor: h };
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
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), a = e("f183"), u = e("2266"), s = e("19aa"), c = e("861d"), l = e("d039"), f = e("1c7e"), g = e("d44e"), v = e("7156");
      i.exports = function(p, h, m) {
        var y = p.indexOf("Map") !== -1, O = p.indexOf("Weak") !== -1, C = y ? "set" : "add", x = o[p], w = x && x.prototype, b = x, E = {}, j = function(J) {
          var q = w[J];
          t(w, J, J == "add" ? function(U) {
            return q.call(this, U === 0 ? 0 : U), this;
          } : J == "delete" ? function(U) {
            return !(O && !c(U)) && q.call(this, U === 0 ? 0 : U);
          } : J == "get" ? function(U) {
            return O && !c(U) ? void 0 : q.call(this, U === 0 ? 0 : U);
          } : J == "has" ? function(U) {
            return !(O && !c(U)) && q.call(this, U === 0 ? 0 : U);
          } : function(U, A) {
            return q.call(this, U === 0 ? 0 : U, A), this;
          });
        }, L = r(p, typeof x != "function" || !(O || w.forEach && !l(function() {
          new x().entries().next();
        })));
        if (L) b = m.getConstructor(h, p, y, C), a.REQUIRED = !0;
        else if (r(p, !0)) {
          var S = new b(), I = S[C](O ? {} : -0, 1) != S, W = l(function() {
            S.has(1);
          }), Z = f(function(J) {
            new x(J);
          }), ae = !O && l(function() {
            for (var J = new x(), q = 5; q--; ) J[C](q, q);
            return !J.has(-0);
          });
          Z || (b = h(function(J, q) {
            s(J, b, p);
            var U = v(new x(), J, b);
            return q != null && u(q, U[C], { that: U, AS_ENTRIES: y }), U;
          }), b.prototype = w, w.constructor = b), (W || ae) && (j("delete"), j("has"), y && j("get")), (ae || I) && j(C), O && w.clear && delete w.clear;
        }
        return E[p] = b, n({ global: !0, forced: b != x }, E), g(b, p), O || m.setStrong(b, p, y), b;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), a = e("8925"), u = e("69f3"), s = u.get, c = u.enforce, l = String(String).split("String");
      (i.exports = function(f, g, v, p) {
        var h, m = !!p && !!p.unsafe, y = !!p && !!p.enumerable, O = !!p && !!p.noTargetGet;
        typeof v == "function" && (typeof g != "string" || r(v, "name") || o(v, "name", g), h = c(v), h.source || (h.source = l.join(typeof g == "string" ? g : ""))), f !== n ? (m ? !O && f[g] && (y = !0) : delete f[g], y ? f[g] = v : o(f, g, v)) : y ? f[g] = v : t(g, v);
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
          var c = [];
          c.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && c.push("expires=" + new Date(t).toGMTString()), n.isString(a) && c.push("path=" + a), n.isString(u) && c.push("domain=" + u), s === !0 && c.push("secure"), document.cookie = c.join("; ");
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
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), a = e("d012"), u = e("1be4"), s = e("cc12"), c = e("f772"), l = ">", f = "<", g = "prototype", v = "script", p = c("IE_PROTO"), h = function() {
      }, m = function(x) {
        return f + v + l + x + f + "/" + v + l;
      }, y = function(x) {
        x.write(m("")), x.close();
        var w = x.parentWindow.Object;
        return x = null, w;
      }, O = function() {
        var x, w = s("iframe"), b = "java" + v + ":";
        return w.style.display = "none", u.appendChild(w), w.src = String(b), x = w.contentWindow.document, x.open(), x.write(m("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? y(n) : O();
        for (var x = t.length; x--; ) delete C[g][t[x]];
        return C();
      };
      a[p] = !0, i.exports = Object.create || function(x, w) {
        var b;
        return x !== null ? (h[g] = o(x), b = new h(), h[g] = null, b[p] = x) : b = C(), w === void 0 ? b : r(b, w);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", a = !0;
      t in [] && Array(1)[t](function() {
        a = !1;
      }), n({ target: "Array", proto: !0, forced: a }, { find: function(u) {
        return o(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), a = e("d44e"), u = e("9112"), s = e("6eeb"), c = e("b622"), l = e("c430"), f = e("3f8c"), g = e("ae93"), v = g.IteratorPrototype, p = g.BUGGY_SAFARI_ITERATORS, h = c("iterator"), m = "keys", y = "values", O = "entries", C = function() {
        return this;
      };
      i.exports = function(x, w, b, E, j, L, S) {
        o(b, w, E);
        var I, W, Z, ae = function(ne) {
          if (ne === j && T) return T;
          if (!p && ne in U) return U[ne];
          switch (ne) {
            case m:
              return function() {
                return new b(this, ne);
              };
            case y:
              return function() {
                return new b(this, ne);
              };
            case O:
              return function() {
                return new b(this, ne);
              };
          }
          return function() {
            return new b(this);
          };
        }, J = w + " Iterator", q = !1, U = x.prototype, A = U[h] || U["@@iterator"] || j && U[j], T = !p && A || ae(j), K = w == "Array" && U.entries || A;
        if (K && (I = r(K.call(new x())), v !== Object.prototype && I.next && (l || r(I) === v || (t ? t(I, v) : typeof I[h] != "function" && u(I, h, C)), a(I, J, !0, !0), l && (f[J] = C))), j == y && A && A.name !== y && (q = !0, T = function() {
          return A.call(this);
        }), l && !S || U[h] === T || u(U, h, T), f[w] = T, j) if (W = { values: ae(y), keys: L ? T : ae(m), entries: ae(O) }, S) for (Z in W) (p || q || !(Z in U)) && s(U, Z, W[Z]);
        else n({ target: w, proto: !0, forced: p || q }, W);
        return W;
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
          } catch (O) {
            var u, s, c, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, g = l.exec(O.stack) || f.exec(O.stack), v = g && g[1] || !1, p = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            v === h && (u = document.documentElement.outerHTML, s = new RegExp("(?:[^\\n]+?\\n){0," + (p - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), c = u.replace(s, "$1").trim());
            for (var y = 0; y < m.length; y++)
              if (m[y].readyState === "interactive" || m[y].src === v || v === h && m[y].innerHTML && m[y].innerHTML.trim() === c) return m[y];
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
        var f = /a/, g = /b*/g;
        return r.call(f, "a"), r.call(g, "a"), f.lastIndex !== 0 || g.lastIndex !== 0;
      }(), s = o.UNSUPPORTED_Y || o.BROKEN_CARET, c = /()??/.exec("")[1] !== void 0, l = u || c || s;
      l && (a = function(f) {
        var g, v, p, h, m = this, y = s && m.sticky, O = n.call(m), C = m.source, x = 0, w = f;
        return y && (O = O.replace("y", ""), O.indexOf("g") === -1 && (O += "g"), w = String(f).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && f[m.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", w = " " + w, x++), v = new RegExp("^(?:" + C + ")", O)), c && (v = new RegExp("^" + C + "$(?!\\s)", O)), u && (g = m.lastIndex), p = r.call(y ? v : m, w), y ? p ? (p.input = p.input.slice(x), p[0] = p[0].slice(x), p.index = m.lastIndex, m.lastIndex += p[0].length) : m.lastIndex = 0 : u && p && (m.lastIndex = m.global ? p.index + p[0].length : g), c && p && p.length > 1 && t.call(p[0], v, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (p[h] = void 0);
        }), p;
      }), i.exports = a;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(c, l) {
        var f = a[t(c)];
        return f == s || f != u && (typeof l == "function" ? n(l) : !!l);
      }, t = r.normalize = function(c) {
        return String(c).replace(o, ".").toLowerCase();
      }, a = r.data = {}, u = r.NATIVE = "N", s = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, a = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", s = t.toStringTag || "@@toStringTag", c = typeof i == "object", l = e.regeneratorRuntime;
        if (l) c && (i.exports = l);
        else {
          l = e.regeneratorRuntime = c ? i.exports : {}, l.wrap = x;
          var f = "suspendedStart", g = "suspendedYield", v = "executing", p = "completed", h = {}, m = {};
          m[a] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, O = y && y(y(q([])));
          O && O !== o && r.call(O, a) && (m = O);
          var C = j.prototype = b.prototype = Object.create(m);
          E.prototype = C.constructor = j, j.constructor = E, j[s] = E.displayName = "GeneratorFunction", l.isGeneratorFunction = function(A) {
            var T = typeof A == "function" && A.constructor;
            return !!T && (T === E || (T.displayName || T.name) === "GeneratorFunction");
          }, l.mark = function(A) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(A, j) : (A.__proto__ = j, s in A || (A[s] = "GeneratorFunction")), A.prototype = Object.create(C), A;
          }, l.awrap = function(A) {
            return { __await: A };
          }, L(S.prototype), S.prototype[u] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(A, T, K, ne) {
            var M = new S(x(A, T, K, ne));
            return l.isGeneratorFunction(T) ? M : M.next().then(function(Se) {
              return Se.done ? Se.value : M.next();
            });
          }, L(C), C[s] = "Generator", C[a] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, l.keys = function(A) {
            var T = [];
            for (var K in A) T.push(K);
            return T.reverse(), function ne() {
              for (; T.length; ) {
                var M = T.pop();
                if (M in A) return ne.value = M, ne.done = !1, ne;
              }
              return ne.done = !0, ne;
            };
          }, l.values = q, J.prototype = { constructor: J, reset: function(A) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !A) for (var T in this) T.charAt(0) === "t" && r.call(this, T) && !isNaN(+T.slice(1)) && (this[T] = n);
          }, stop: function() {
            this.done = !0;
            var A = this.tryEntries[0], T = A.completion;
            if (T.type === "throw") throw T.arg;
            return this.rval;
          }, dispatchException: function(A) {
            if (this.done) throw A;
            var T = this;
            function K(Ae, Fe) {
              return Se.type = "throw", Se.arg = A, T.next = Ae, Fe && (T.method = "next", T.arg = n), !!Fe;
            }
            for (var ne = this.tryEntries.length - 1; ne >= 0; --ne) {
              var M = this.tryEntries[ne], Se = M.completion;
              if (M.tryLoc === "root") return K("end");
              if (M.tryLoc <= this.prev) {
                var ve = r.call(M, "catchLoc"), Ue = r.call(M, "finallyLoc");
                if (ve && Ue) {
                  if (this.prev < M.catchLoc) return K(M.catchLoc, !0);
                  if (this.prev < M.finallyLoc) return K(M.finallyLoc);
                } else if (ve) {
                  if (this.prev < M.catchLoc) return K(M.catchLoc, !0);
                } else {
                  if (!Ue) throw new Error("try statement without catch or finally");
                  if (this.prev < M.finallyLoc) return K(M.finallyLoc);
                }
              }
            }
          }, abrupt: function(A, T) {
            for (var K = this.tryEntries.length - 1; K >= 0; --K) {
              var ne = this.tryEntries[K];
              if (ne.tryLoc <= this.prev && r.call(ne, "finallyLoc") && this.prev < ne.finallyLoc) {
                var M = ne;
                break;
              }
            }
            M && (A === "break" || A === "continue") && M.tryLoc <= T && T <= M.finallyLoc && (M = null);
            var Se = M ? M.completion : {};
            return Se.type = A, Se.arg = T, M ? (this.method = "next", this.next = M.finallyLoc, h) : this.complete(Se);
          }, complete: function(A, T) {
            if (A.type === "throw") throw A.arg;
            return A.type === "break" || A.type === "continue" ? this.next = A.arg : A.type === "return" ? (this.rval = this.arg = A.arg, this.method = "return", this.next = "end") : A.type === "normal" && T && (this.next = T), h;
          }, finish: function(A) {
            for (var T = this.tryEntries.length - 1; T >= 0; --T) {
              var K = this.tryEntries[T];
              if (K.finallyLoc === A) return this.complete(K.completion, K.afterLoc), ae(K), h;
            }
          }, catch: function(A) {
            for (var T = this.tryEntries.length - 1; T >= 0; --T) {
              var K = this.tryEntries[T];
              if (K.tryLoc === A) {
                var ne = K.completion;
                if (ne.type === "throw") {
                  var M = ne.arg;
                  ae(K);
                }
                return M;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(A, T, K) {
            return this.delegate = { iterator: q(A), resultName: T, nextLoc: K }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function x(A, T, K, ne) {
          var M = T && T.prototype instanceof b ? T : b, Se = Object.create(M.prototype), ve = new J(ne || []);
          return Se._invoke = I(A, K, ve), Se;
        }
        function w(A, T, K) {
          try {
            return { type: "normal", arg: A.call(T, K) };
          } catch (ne) {
            return { type: "throw", arg: ne };
          }
        }
        function b() {
        }
        function E() {
        }
        function j() {
        }
        function L(A) {
          ["next", "throw", "return"].forEach(function(T) {
            A[T] = function(K) {
              return this._invoke(T, K);
            };
          });
        }
        function S(A) {
          function T(M, Se, ve, Ue) {
            var Ae = w(A[M], A, Se);
            if (Ae.type !== "throw") {
              var Fe = Ae.arg, Ne = Fe.value;
              return Ne && typeof Ne == "object" && r.call(Ne, "__await") ? Promise.resolve(Ne.__await).then(function(Re) {
                T("next", Re, ve, Ue);
              }, function(Re) {
                T("throw", Re, ve, Ue);
              }) : Promise.resolve(Ne).then(function(Re) {
                Fe.value = Re, ve(Fe);
              }, Ue);
            }
            Ue(Ae.arg);
          }
          var K;
          function ne(M, Se) {
            function ve() {
              return new Promise(function(Ue, Ae) {
                T(M, Se, Ue, Ae);
              });
            }
            return K = K ? K.then(ve, ve) : ve();
          }
          this._invoke = ne;
        }
        function I(A, T, K) {
          var ne = f;
          return function(M, Se) {
            if (ne === v) throw new Error("Generator is already running");
            if (ne === p) {
              if (M === "throw") throw Se;
              return U();
            }
            for (K.method = M, K.arg = Se; ; ) {
              var ve = K.delegate;
              if (ve) {
                var Ue = W(ve, K);
                if (Ue) {
                  if (Ue === h) continue;
                  return Ue;
                }
              }
              if (K.method === "next") K.sent = K._sent = K.arg;
              else if (K.method === "throw") {
                if (ne === f) throw ne = p, K.arg;
                K.dispatchException(K.arg);
              } else K.method === "return" && K.abrupt("return", K.arg);
              ne = v;
              var Ae = w(A, T, K);
              if (Ae.type === "normal") {
                if (ne = K.done ? p : g, Ae.arg === h) continue;
                return { value: Ae.arg, done: K.done };
              }
              Ae.type === "throw" && (ne = p, K.method = "throw", K.arg = Ae.arg);
            }
          };
        }
        function W(A, T) {
          var K = A.iterator[T.method];
          if (K === n) {
            if (T.delegate = null, T.method === "throw") {
              if (A.iterator.return && (T.method = "return", T.arg = n, W(A, T), T.method === "throw")) return h;
              T.method = "throw", T.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var ne = w(K, A.iterator, T.arg);
          if (ne.type === "throw") return T.method = "throw", T.arg = ne.arg, T.delegate = null, h;
          var M = ne.arg;
          return M ? M.done ? (T[A.resultName] = M.value, T.next = A.nextLoc, T.method !== "return" && (T.method = "next", T.arg = n), T.delegate = null, h) : M : (T.method = "throw", T.arg = new TypeError("iterator result is not an object"), T.delegate = null, h);
        }
        function Z(A) {
          var T = { tryLoc: A[0] };
          1 in A && (T.catchLoc = A[1]), 2 in A && (T.finallyLoc = A[2], T.afterLoc = A[3]), this.tryEntries.push(T);
        }
        function ae(A) {
          var T = A.completion || {};
          T.type = "normal", delete T.arg, A.completion = T;
        }
        function J(A) {
          this.tryEntries = [{ tryLoc: "root" }], A.forEach(Z, this), this.reset(!0);
        }
        function q(A) {
          if (A) {
            var T = A[a];
            if (T) return T.call(A);
            if (typeof A.next == "function") return A;
            if (!isNaN(A.length)) {
              var K = -1, ne = function M() {
                for (; ++K < A.length; ) if (r.call(A, K)) return M.value = A[K], M.done = !1, M;
                return M.value = n, M.done = !0, M;
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
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), a = e("7b0b"), u = e("50c4"), s = e("8418"), c = e("65f0"), l = e("1dde"), f = e("b622"), g = e("2d00"), v = f("isConcatSpreadable"), p = 9007199254740991, h = "Maximum allowed index exceeded", m = g >= 51 || !o(function() {
        var x = [];
        return x[v] = !1, x.concat()[0] !== x;
      }), y = l("concat"), O = function(x) {
        if (!t(x)) return !1;
        var w = x[v];
        return w !== void 0 ? !!w : r(x);
      }, C = !m || !y;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var w, b, E, j, L, S = a(this), I = c(S, 0), W = 0;
        for (w = -1, E = arguments.length; w < E; w++) if (L = w === -1 ? S : arguments[w], O(L)) {
          if (j = u(L.length), W + j > p) throw TypeError(h);
          for (b = 0; b < j; b++, W++) b in L && s(I, W, L[b]);
        } else {
          if (W >= p) throw TypeError(h);
          s(I, W++, L);
        }
        return I.length = W, I;
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
      d.f = n ? a : function(u, s, c) {
        if (r(u), s = t(s, !0), r(c), o) try {
          return a(u, s, c);
        } catch {
        }
        if ("get" in c || "set" in c) throw TypeError("Accessors not supported");
        return "value" in c && (u[s] = c.value), u;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), a = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(s, c, l) {
        var f = c + " Iterator";
        return s.prototype = o(n, { next: r(1, l) }), t(s, f, !1, !0), a[f] = u, s;
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
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), a = e("7b0b"), u = e("65f0"), s = e("8418"), c = e("1dde"), l = c("splice"), f = Math.max, g = Math.min, v = 9007199254740991, p = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, m) {
        var y, O, C, x, w, b, E = a(this), j = t(E.length), L = o(h, j), S = arguments.length;
        if (S === 0 ? y = O = 0 : S === 1 ? (y = 0, O = j - L) : (y = S - 2, O = g(f(r(m), 0), j - L)), j + y - O > v) throw TypeError(p);
        for (C = u(E, O), x = 0; x < O; x++) w = L + x, w in E && s(C, x, E[w]);
        if (C.length = O, y < O) {
          for (x = L; x < j - O; x++) w = x + O, b = x + y, w in E ? E[b] = E[w] : delete E[b];
          for (x = j; x > j - O + y; x--) delete E[x - 1];
        } else if (y > O) for (x = j - O; x > L; x--) w = x + O - 1, b = x + y - 1, w in E ? E[b] = E[w] : delete E[b];
        for (x = 0; x < y; x++) E[x + L] = arguments[x + 2];
        return E.length = j - O + y, C;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), a = e("83ab"), u = e("4930"), s = e("fdbf"), c = e("d039"), l = e("5135"), f = e("e8b5"), g = e("861d"), v = e("825a"), p = e("7b0b"), h = e("fc6a"), m = e("c04e"), y = e("5c6c"), O = e("7c73"), C = e("df75"), x = e("241c"), w = e("057f"), b = e("7418"), E = e("06cf"), j = e("9bf2"), L = e("d1e7"), S = e("9112"), I = e("6eeb"), W = e("5692"), Z = e("f772"), ae = e("d012"), J = e("90e3"), q = e("b622"), U = e("e538"), A = e("746f"), T = e("d44e"), K = e("69f3"), ne = e("b727").forEach, M = Z("hidden"), Se = "Symbol", ve = "prototype", Ue = q("toPrimitive"), Ae = K.set, Fe = K.getterFor(Se), Ne = Object[ve], Re = o.Symbol, He = r("JSON", "stringify"), Ke = E.f, R = j.f, $ = w.f, ee = L.f, F = W("symbols"), te = W("op-symbols"), re = W("string-to-symbol-registry"), we = W("symbol-to-string-registry"), he = W("wks"), ce = o.QObject, _e = !ce || !ce[ve] || !ce[ve].findChild, Oe = a && c(function() {
        return O(R({}, "a", { get: function() {
          return R(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(z, oe, le) {
        var ge = Ke(Ne, oe);
        ge && delete Ne[oe], R(z, oe, le), ge && z !== Ne && R(Ne, oe, ge);
      } : R, $e = function(z, oe) {
        var le = F[z] = O(Re[ve]);
        return Ae(le, { type: Se, tag: z, description: oe }), a || (le.description = oe), le;
      }, Ce = s ? function(z) {
        return typeof z == "symbol";
      } : function(z) {
        return Object(z) instanceof Re;
      }, ie = function(z, oe, le) {
        z === Ne && ie(te, oe, le), v(z);
        var ge = m(oe, !0);
        return v(le), l(F, ge) ? (le.enumerable ? (l(z, M) && z[M][ge] && (z[M][ge] = !1), le = O(le, { enumerable: y(0, !1) })) : (l(z, M) || R(z, M, y(1, {})), z[M][ge] = !0), Oe(z, ge, le)) : R(z, ge, le);
      }, D = function(z, oe) {
        v(z);
        var le = h(oe), ge = C(le).concat(fe(le));
        return ne(ge, function(Ve) {
          a && !Pe.call(le, Ve) || ie(z, Ve, le[Ve]);
        }), z;
      }, G = function(z, oe) {
        return oe === void 0 ? O(z) : D(O(z), oe);
      }, Pe = function(z) {
        var oe = m(z, !0), le = ee.call(this, oe);
        return !(this === Ne && l(F, oe) && !l(te, oe)) && (!(le || !l(this, oe) || !l(F, oe) || l(this, M) && this[M][oe]) || le);
      }, Q = function(z, oe) {
        var le = h(z), ge = m(oe, !0);
        if (le !== Ne || !l(F, ge) || l(te, ge)) {
          var Ve = Ke(le, ge);
          return !Ve || !l(F, ge) || l(le, M) && le[M][ge] || (Ve.enumerable = !0), Ve;
        }
      }, se = function(z) {
        var oe = $(h(z)), le = [];
        return ne(oe, function(ge) {
          l(F, ge) || l(ae, ge) || le.push(ge);
        }), le;
      }, fe = function(z) {
        var oe = z === Ne, le = $(oe ? te : h(z)), ge = [];
        return ne(le, function(Ve) {
          !l(F, Ve) || oe && !l(Ne, Ve) || ge.push(F[Ve]);
        }), ge;
      };
      if (u || (Re = function() {
        if (this instanceof Re) throw TypeError("Symbol is not a constructor");
        var z = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = J(z), le = function(ge) {
          this === Ne && le.call(te, ge), l(this, M) && l(this[M], oe) && (this[M][oe] = !1), Oe(this, oe, y(1, ge));
        };
        return a && _e && Oe(Ne, oe, { configurable: !0, set: le }), $e(oe, z);
      }, I(Re[ve], "toString", function() {
        return Fe(this).tag;
      }), I(Re, "withoutSetter", function(z) {
        return $e(J(z), z);
      }), L.f = Pe, j.f = ie, E.f = Q, x.f = w.f = se, b.f = fe, U.f = function(z) {
        return $e(q(z), z);
      }, a && (R(Re[ve], "description", { configurable: !0, get: function() {
        return Fe(this).description;
      } }), t || I(Ne, "propertyIsEnumerable", Pe, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Re }), ne(C(he), function(z) {
        A(z);
      }), n({ target: Se, stat: !0, forced: !u }, { for: function(z) {
        var oe = String(z);
        if (l(re, oe)) return re[oe];
        var le = Re(oe);
        return re[oe] = le, we[le] = oe, le;
      }, keyFor: function(z) {
        if (!Ce(z)) throw TypeError(z + " is not a symbol");
        if (l(we, z)) return we[z];
      }, useSetter: function() {
        _e = !0;
      }, useSimple: function() {
        _e = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !a }, { create: G, defineProperty: ie, defineProperties: D, getOwnPropertyDescriptor: Q }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: se, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: c(function() {
        b.f(1);
      }) }, { getOwnPropertySymbols: function(z) {
        return b.f(p(z));
      } }), He) {
        var me = !u || c(function() {
          var z = Re();
          return He([z]) != "[null]" || He({ a: z }) != "{}" || He(Object(z)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: me }, { stringify: function(z, oe, le) {
          for (var ge, Ve = [z], Ge = 1; arguments.length > Ge; ) Ve.push(arguments[Ge++]);
          if (ge = oe, (g(oe) || z !== void 0) && !Ce(z)) return f(oe) || (oe = function(rt, je) {
            if (typeof ge == "function" && (je = ge.call(this, rt, je)), !Ce(je)) return je;
          }), Ve[1] = oe, He.apply(null, Ve);
        } });
      }
      Re[ve][Ue] || S(Re[ve], Ue, Re[ve].valueOf), T(Re, Se), ae[M] = !0;
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
      var n, o, r, t = e("d039"), a = e("e163"), u = e("9112"), s = e("5135"), c = e("b622"), l = e("c430"), f = c("iterator"), g = !1, v = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = a(a(r)), o !== Object.prototype && (n = o)) : g = !0);
      var p = n == null || t(function() {
        var h = {};
        return n[f].call(h) !== h;
      });
      p && (n = {}), l && !p || s(n, f) || u(n, f, v), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
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
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), a = e("83b9"), u = e("c345"), s = e("3934"), c = e("2d83");
      i.exports = function(l) {
        return new Promise(function(f, g) {
          var v = l.data, p = l.headers;
          n.isFormData(v) && delete p["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", y = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            p.Authorization = "Basic " + btoa(m + ":" + y);
          }
          var O = a(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(O, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in h ? u(h.getAllResponseHeaders()) : null, w = l.responseType && l.responseType !== "text" ? h.response : h.responseText, b = { data: w, status: h.status, statusText: h.statusText, headers: x, config: l, request: h };
              o(f, g, b), h = null;
            }
          }, h.onabort = function() {
            h && (g(c("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(c("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var x = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (x = l.timeoutErrorMessage), g(c(x, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (l.withCredentials || s(O)) && l.xsrfCookieName ? r.read(l.xsrfCookieName) : void 0;
            C && (p[l.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(p, function(x, w) {
            typeof v > "u" && w.toLowerCase() === "content-type" ? delete p[w] : h.setRequestHeader(w, x);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (x) {
            if (l.responseType !== "json") throw x;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(x) {
            h && (h.abort(), g(x), h = null);
          }), v || (v = null), h.send(v);
        });
      };
    }, b575: function(i, d, e) {
      var n, o, r, t, a, u, s, c, l = e("da84"), f = e("06cf").f, g = e("2cf4").set, v = e("1cdc"), p = e("a4b4"), h = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, y = l.document, O = l.process, C = l.Promise, x = f(l, "queueMicrotask"), w = x && x.value;
      w || (n = function() {
        var b, E;
        for (h && (b = O.domain) && b.exit(); o; ) {
          E = o.fn, o = o.next;
          try {
            E();
          } catch (j) {
            throw o ? t() : r = void 0, j;
          }
        }
        r = void 0, b && b.enter();
      }, v || h || p || !m || !y ? C && C.resolve ? (s = C.resolve(void 0), c = s.then, t = function() {
        c.call(s, n);
      }) : t = h ? function() {
        O.nextTick(n);
      } : function() {
        g.call(l, n);
      } : (a = !0, u = y.createTextNode(""), new m(n).observe(u, { characterData: !0 }), t = function() {
        u.data = a = !a;
      })), i.exports = w || function(b) {
        var E = { fn: b, next: void 0 };
        r && (r.next = E), o || (o = E, t()), r = E;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), a = e("4930"), u = e("fdbf"), s = o("wks"), c = n.Symbol, l = u ? c : c && c.withoutSetter || t;
      i.exports = function(f) {
        return r(s, f) && (a || typeof s[f] == "string") || (a && r(c, f) ? s[f] = c[f] : s[f] = l("Symbol." + f)), s[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), a = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: a }, { keys: function(u) {
        return r(o(u));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), a = e("d039"), u = 1 .toFixed, s = Math.floor, c = function(h, m, y) {
        return m === 0 ? y : m % 2 === 1 ? c(h, m - 1, y * h) : c(h * h, m / 2, y);
      }, l = function(h) {
        for (var m = 0, y = h; y >= 4096; ) m += 12, y /= 4096;
        for (; y >= 2; ) m += 1, y /= 2;
        return m;
      }, f = function(h, m, y) {
        for (var O = -1, C = y; ++O < 6; ) C += m * h[O], h[O] = C % 1e7, C = s(C / 1e7);
      }, g = function(h, m) {
        for (var y = 6, O = 0; --y >= 0; ) O += h[y], h[y] = s(O / m), O = O % m * 1e7;
      }, v = function(h) {
        for (var m = 6, y = ""; --m >= 0; ) if (y !== "" || m === 0 || h[m] !== 0) {
          var O = String(h[m]);
          y = y === "" ? O : y + t.call("0", 7 - O.length) + O;
        }
        return y;
      }, p = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !a(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: p }, { toFixed: function(h) {
        var m, y, O, C, x = r(this), w = o(h), b = [0, 0, 0, 0, 0, 0], E = "", j = "0";
        if (w < 0 || w > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (E = "-", x = -x), x > 1e-21) if (m = l(x * c(2, 69, 1)) - 69, y = m < 0 ? x * c(2, -m, 1) : x / c(2, m, 1), y *= 4503599627370496, m = 52 - m, m > 0) {
          for (f(b, 0, y), O = w; O >= 7; ) f(b, 1e7, 0), O -= 7;
          for (f(b, c(10, O, 1), 0), O = m - 1; O >= 23; ) g(b, 1 << 23), O -= 23;
          g(b, 1 << O), f(b, 1, 1), g(b, 2), j = v(b);
        } else f(b, 0, y), f(b, 1 << -m, 0), j = v(b) + t.call("0", w);
        return w > 0 ? (C = j.length, j = E + (C <= w ? "0." + t.call("0", w - C) + j : j.slice(0, C - w) + "." + j.slice(C - w))) : j = E + j, j;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), a = e("65f0"), u = [].push, s = function(c) {
        var l = c == 1, f = c == 2, g = c == 3, v = c == 4, p = c == 6, h = c == 7, m = c == 5 || p;
        return function(y, O, C, x) {
          for (var w, b, E = r(y), j = o(E), L = n(O, C, 3), S = t(j.length), I = 0, W = x || a, Z = l ? W(y, S) : f || h ? W(y, 0) : void 0; S > I; I++) if ((m || I in j) && (w = j[I], b = L(w, I, E), c)) if (l) Z[I] = b;
          else if (b) switch (c) {
            case 3:
              return !0;
            case 5:
              return w;
            case 6:
              return I;
            case 2:
              u.call(Z, w);
          }
          else switch (c) {
            case 4:
              return !1;
            case 7:
              u.call(Z, w);
          }
          return p ? -1 : g || v ? v : Z;
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
`), function(c) {
          if (u = c.indexOf(":"), t = n.trim(c.substr(0, u)).toLowerCase(), a = n.trim(c.substr(u + 1)), t) {
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
      function r(S) {
        return o.call(S) === "[object Array]";
      }
      function t(S) {
        return typeof S > "u";
      }
      function a(S) {
        return S !== null && !t(S) && S.constructor !== null && !t(S.constructor) && typeof S.constructor.isBuffer == "function" && S.constructor.isBuffer(S);
      }
      function u(S) {
        return o.call(S) === "[object ArrayBuffer]";
      }
      function s(S) {
        return typeof FormData < "u" && S instanceof FormData;
      }
      function c(S) {
        var I;
        return I = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, I;
      }
      function l(S) {
        return typeof S == "string";
      }
      function f(S) {
        return typeof S == "number";
      }
      function g(S) {
        return S !== null && typeof S == "object";
      }
      function v(S) {
        if (o.call(S) !== "[object Object]") return !1;
        var I = Object.getPrototypeOf(S);
        return I === null || I === Object.prototype;
      }
      function p(S) {
        return o.call(S) === "[object Date]";
      }
      function h(S) {
        return o.call(S) === "[object File]";
      }
      function m(S) {
        return o.call(S) === "[object Blob]";
      }
      function y(S) {
        return o.call(S) === "[object Function]";
      }
      function O(S) {
        return g(S) && y(S.pipe);
      }
      function C(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function x(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function w() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function b(S, I) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), r(S)) for (var W = 0, Z = S.length; W < Z; W++) I.call(null, S[W], W, S);
        else for (var ae in S) Object.prototype.hasOwnProperty.call(S, ae) && I.call(null, S[ae], ae, S);
      }
      function E() {
        var S = {};
        function I(ae, J) {
          v(S[J]) && v(ae) ? S[J] = E(S[J], ae) : v(ae) ? S[J] = E({}, ae) : r(ae) ? S[J] = ae.slice() : S[J] = ae;
        }
        for (var W = 0, Z = arguments.length; W < Z; W++) b(arguments[W], I);
        return S;
      }
      function j(S, I, W) {
        return b(I, function(Z, ae) {
          S[ae] = W && typeof Z == "function" ? n(Z, W) : Z;
        }), S;
      }
      function L(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: r, isArrayBuffer: u, isBuffer: a, isFormData: s, isArrayBufferView: c, isString: l, isNumber: f, isObject: g, isPlainObject: v, isUndefined: t, isDate: p, isFile: h, isBlob: m, isFunction: y, isStream: O, isURLSearchParams: C, isStandardBrowserEnv: w, forEach: b, merge: E, extend: j, trim: x, stripBOM: L };
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
        var s, c = o(a), l = 0, f = [];
        for (s in c) !n(t, s) && n(c, s) && f.push(s);
        for (; u.length > l; ) n(c, s = u[l++]) && (~r(f, s) || f.push(s));
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
      function u(c) {
        var l = new r(c), f = o(r.prototype.request, l);
        return n.extend(f, r.prototype, l), n.extend(f, l), f;
      }
      var s = u(a);
      s.Axios = r, s.create = function(c) {
        return u(t(s.defaults, c));
      }, s.Cancel = e("7a77"), s.CancelToken = e("8df4"), s.isCancel = e("2e67"), s.all = function(c) {
        return Promise.all(c);
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
        return function(s, c, l, f) {
          n(c);
          var g = o(s), v = r(g), p = t(g.length), h = u ? p - 1 : 0, m = u ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in v) {
              f = v[h], h += m;
              break;
            }
            if (h += m, u ? h < 0 : p <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? h >= 0 : p > h; h += m) h in v && (f = c(f, v[h], h, g));
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
        var v = /./;
        return v.exec = function() {
          var p = [];
          return p.groups = { a: "7" }, p;
        }, "".replace(v, "$<a>") !== "7";
      }), c = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = r("replace"), f = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), g = !o(function() {
        var v = /(?:)/, p = v.exec;
        v.exec = function() {
          return p.apply(this, arguments);
        };
        var h = "ab".split(v);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      i.exports = function(v, p, h, m) {
        var y = r(v), O = !o(function() {
          var j = {};
          return j[y] = function() {
            return 7;
          }, ""[v](j) != 7;
        }), C = O && !o(function() {
          var j = !1, L = /a/;
          return v === "split" && (L = {}, L.constructor = {}, L.constructor[u] = function() {
            return L;
          }, L.flags = "", L[y] = /./[y]), L.exec = function() {
            return j = !0, null;
          }, L[y](""), !j;
        });
        if (!O || !C || v === "replace" && (!s || !c || f) || v === "split" && !g) {
          var x = /./[y], w = h(y, ""[v], function(j, L, S, I, W) {
            return L.exec === t ? O && !W ? { done: !0, value: x.call(L, S, I) } : { done: !0, value: j.call(S, L, I) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: c, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), b = w[0], E = w[1];
          n(String.prototype, v, b), n(RegExp.prototype, y, p == 2 ? function(j, L) {
            return E.call(j, this, L);
          } : function(j) {
            return E.call(j, this);
          });
        }
        m && a(RegExp.prototype[y], "sham", !0);
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
        for (var c, l, f = t(s), g = a.f, v = r(f), p = {}, h = 0; v.length > h; ) l = g(f, c = v[h++]), l !== void 0 && u(p, c, l);
        return p;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), a = e("b622"), u = a("iterator"), s = a("toStringTag"), c = r.values;
      for (var l in o) {
        var f = n[l], g = f && f.prototype;
        if (g) {
          if (g[u] !== c) try {
            t(g, u, c);
          } catch {
            g[u] = c;
          }
          if (g[s] || t(g, s, l), o[l]) {
            for (var v in r) if (g[v] !== r[v]) try {
              t(g, v, r[v]);
            } catch {
              g[v] = r[v];
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
          for (var c = 0, l = u.length - 1; l >= 0; l--) {
            var f = u[l];
            f === "." ? u.splice(l, 1) : f === ".." ? (u.splice(l, 1), c++) : c && (u.splice(l, 1), c--);
          }
          if (s) for (; c--; c) u.unshift("..");
          return u;
        }
        function r(u) {
          typeof u != "string" && (u += "");
          var s, c = 0, l = -1, f = !0;
          for (s = u.length - 1; s >= 0; --s) if (u.charCodeAt(s) === 47) {
            if (!f) {
              c = s + 1;
              break;
            }
          } else l === -1 && (f = !1, l = s + 1);
          return l === -1 ? "" : u.slice(c, l);
        }
        function t(u, s) {
          if (u.filter) return u.filter(s);
          for (var c = [], l = 0; l < u.length; l++) s(u[l], l, u) && c.push(u[l]);
          return c;
        }
        d.resolve = function() {
          for (var u = "", s = !1, c = arguments.length - 1; c >= -1 && !s; c--) {
            var l = c >= 0 ? arguments[c] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (u = l + "/" + u, s = l.charAt(0) === "/");
          }
          return u = o(t(u.split("/"), function(f) {
            return !!f;
          }), !s).join("/"), (s ? "/" : "") + u || ".";
        }, d.normalize = function(u) {
          var s = d.isAbsolute(u), c = a(u, -1) === "/";
          return u = o(t(u.split("/"), function(l) {
            return !!l;
          }), !s).join("/"), u || s || (u = "."), u && c && (u += "/"), (s ? "/" : "") + u;
        }, d.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, d.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(u, function(s, c) {
            if (typeof s != "string") throw new TypeError("Arguments to path.join must be strings");
            return s;
          }).join("/"));
        }, d.relative = function(u, s) {
          function c(m) {
            for (var y = 0; y < m.length && m[y] === ""; y++) ;
            for (var O = m.length - 1; O >= 0 && m[O] === ""; O--) ;
            return y > O ? [] : m.slice(y, O - y + 1);
          }
          u = d.resolve(u).substr(1), s = d.resolve(s).substr(1);
          for (var l = c(u.split("/")), f = c(s.split("/")), g = Math.min(l.length, f.length), v = g, p = 0; p < g; p++) if (l[p] !== f[p]) {
            v = p;
            break;
          }
          var h = [];
          for (p = v; p < l.length; p++) h.push("..");
          return h = h.concat(f.slice(v)), h.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var s = u.charCodeAt(0), c = s === 47, l = -1, f = !0, g = u.length - 1; g >= 1; --g) if (s = u.charCodeAt(g), s === 47) {
            if (!f) {
              l = g;
              break;
            }
          } else f = !1;
          return l === -1 ? c ? "/" : "." : c && l === 1 ? "/" : u.slice(0, l);
        }, d.basename = function(u, s) {
          var c = r(u);
          return s && c.substr(-1 * s.length) === s && (c = c.substr(0, c.length - s.length)), c;
        }, d.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var s = -1, c = 0, l = -1, f = !0, g = 0, v = u.length - 1; v >= 0; --v) {
            var p = u.charCodeAt(v);
            if (p !== 47) l === -1 && (f = !1, l = v + 1), p === 46 ? s === -1 ? s = v : g !== 1 && (g = 1) : s !== -1 && (g = -1);
            else if (!f) {
              c = v + 1;
              break;
            }
          }
          return s === -1 || l === -1 || g === 0 || g === 1 && s === l - 1 && s === c + 1 ? "" : u.slice(s, l);
        };
        var a = "ab".substr(-1) === "b" ? function(u, s, c) {
          return u.substr(s, c);
        } : function(u, s, c) {
          return s < 0 && (s = u.length + s), u.substr(s, c);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(p) {
            var h = p.id, m = p.viewBox, y = p.content;
            this.id = h, this.viewBox = m, this.content = y;
          };
          o.prototype.stringify = function() {
            return this.content;
          }, o.prototype.toString = function() {
            return this.stringify();
          }, o.prototype.destroy = function() {
            var p = this;
            ["id", "viewBox", "content"].forEach(function(h) {
              return delete p[h];
            });
          };
          var r = function(p) {
            var h = !!document.importNode, m = new DOMParser().parseFromString(p, "image/svg+xml").documentElement;
            return h ? document.importNode(m, !0) : m;
          };
          function t(p, h) {
            return h = { exports: {} }, p(h, h.exports), h.exports;
          }
          var a = t(function(p, h) {
            (function(m, y) {
              p.exports = y();
            })(0, function() {
              function m(b) {
                var E = b && typeof b == "object";
                return E && Object.prototype.toString.call(b) !== "[object RegExp]" && Object.prototype.toString.call(b) !== "[object Date]";
              }
              function y(b) {
                return Array.isArray(b) ? [] : {};
              }
              function O(b, E) {
                var j = E && E.clone === !0;
                return j && m(b) ? w(y(b), b, E) : b;
              }
              function C(b, E, j) {
                var L = b.slice();
                return E.forEach(function(S, I) {
                  typeof L[I] > "u" ? L[I] = O(S, j) : m(S) ? L[I] = w(b[I], S, j) : b.indexOf(S) === -1 && L.push(O(S, j));
                }), L;
              }
              function x(b, E, j) {
                var L = {};
                return m(b) && Object.keys(b).forEach(function(S) {
                  L[S] = O(b[S], j);
                }), Object.keys(E).forEach(function(S) {
                  m(E[S]) && b[S] ? L[S] = w(b[S], E[S], j) : L[S] = O(E[S], j);
                }), L;
              }
              function w(b, E, j) {
                var L = Array.isArray(E), S = j || { arrayMerge: C }, I = S.arrayMerge || C;
                return L ? Array.isArray(b) ? I(b, E, j) : O(E, j) : x(b, E, j);
              }
              return w.all = function(b, E) {
                if (!Array.isArray(b) || b.length < 2) throw new Error("first argument should be an array with at least two elements");
                return b.reduce(function(j, L) {
                  return w(j, L, E);
                });
              }, w;
            });
          }), u = t(function(p, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, p.exports = h.default;
          }), s = function(p) {
            return Object.keys(p).map(function(h) {
              var m = p[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, c = u.svg, l = u.xlink, f = {};
          f[c.name] = c.uri, f[l.name] = l.uri;
          var g = function(p, h) {
            p === void 0 && (p = "");
            var m = a(f, {}), y = s(m);
            return "<svg " + y + ">" + p + "</svg>";
          }, v = function(p) {
            function h() {
              p.apply(this, arguments);
            }
            p && (h.__proto__ = p), h.prototype = Object.create(p && p.prototype), h.prototype.constructor = h;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(y) {
              return new h({ id: y.getAttribute("id"), viewBox: y.getAttribute("viewBox"), content: y.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), p.prototype.destroy.call(this);
            }, h.prototype.mount = function(y) {
              if (this.isMounted) return this.node;
              var O = typeof y == "string" ? document.querySelector(y) : y, C = this.render();
              return this.node = C, O.appendChild(C), C;
            }, h.prototype.render = function() {
              var y = this.stringify();
              return r(g(y)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(o);
          return v;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), a = e("861d"), u = e("9bf2").f, s = e("e893"), c = r.Symbol;
      if (o && typeof c == "function" && (!("description" in c.prototype) || c().description !== void 0)) {
        var l = {}, f = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof f ? new c(m) : m === void 0 ? c() : c(m);
          return m === "" && (l[y] = !0), y;
        };
        s(f, c);
        var g = f.prototype = c.prototype;
        g.constructor = f;
        var v = g.toString, p = String(c("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        u(g, "description", { configurable: !0, get: function() {
          var m = a(this) ? this.valueOf() : this, y = v.call(m);
          if (t(l, m)) return "";
          var O = p ? y.slice(7, -1) : y.replace(h, "$1");
          return O === "" ? void 0 : O;
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
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), a = e("7dd0"), u = "Array Iterator", s = t.set, c = t.getterFor(u);
      i.exports = a(Array, "Array", function(l, f) {
        s(this, { type: u, target: n(l), index: 0, kind: f });
      }, function() {
        var l = c(this), f = l.target, g = l.kind, v = l.index++;
        return !f || v >= f.length ? (l.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: v, done: !1 } : g == "values" ? { value: f[v], done: !1 } : { value: [v, f[v]], done: !1 };
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
      n({ target: "Object", stat: !0, forced: s, sham: !a }, { getOwnPropertyDescriptor: function(c, l) {
        return t(r(c), l);
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
      var n, o, r, t, a = e("23e7"), u = e("c430"), s = e("da84"), c = e("d066"), l = e("fea9"), f = e("6eeb"), g = e("e2cc"), v = e("d44e"), p = e("2626"), h = e("861d"), m = e("1c0b"), y = e("19aa"), O = e("8925"), C = e("2266"), x = e("1c7e"), w = e("4840"), b = e("2cf4").set, E = e("b575"), j = e("cdf9"), L = e("44de"), S = e("f069"), I = e("e667"), W = e("69f3"), Z = e("94ca"), ae = e("b622"), J = e("605d"), q = e("2d00"), U = ae("species"), A = "Promise", T = W.get, K = W.set, ne = W.getterFor(A), M = l, Se = s.TypeError, ve = s.document, Ue = s.process, Ae = c("fetch"), Fe = S.f, Ne = Fe, Re = !!(ve && ve.createEvent && s.dispatchEvent), He = typeof PromiseRejectionEvent == "function", Ke = "unhandledrejection", R = "rejectionhandled", $ = 0, ee = 1, F = 2, te = 1, re = 2, we = Z(A, function() {
        var Q = O(M) !== String(M);
        if (!Q && (q === 66 || !J && !He) || u && !M.prototype.finally) return !0;
        if (q >= 51 && /native code/.test(M)) return !1;
        var se = M.resolve(1), fe = function(z) {
          z(function() {
          }, function() {
          });
        }, me = se.constructor = {};
        return me[U] = fe, !(se.then(function() {
        }) instanceof fe);
      }), he = we || !x(function(Q) {
        M.all(Q).catch(function() {
        });
      }), ce = function(Q) {
        var se;
        return !(!h(Q) || typeof (se = Q.then) != "function") && se;
      }, _e = function(Q, se) {
        if (!Q.notified) {
          Q.notified = !0;
          var fe = Q.reactions;
          E(function() {
            for (var me = Q.value, z = Q.state == ee, oe = 0; fe.length > oe; ) {
              var le, ge, Ve, Ge = fe[oe++], rt = z ? Ge.ok : Ge.fail, je = Ge.resolve, it = Ge.reject, Ze = Ge.domain;
              try {
                rt ? (z || (Q.rejection === re && ie(Q), Q.rejection = te), rt === !0 ? le = me : (Ze && Ze.enter(), le = rt(me), Ze && (Ze.exit(), Ve = !0)), le === Ge.promise ? it(Se("Promise-chain cycle")) : (ge = ce(le)) ? ge.call(le, je, it) : je(le)) : it(me);
              } catch (yt) {
                Ze && !Ve && Ze.exit(), it(yt);
              }
            }
            Q.reactions = [], Q.notified = !1, se && !Q.rejection && $e(Q);
          });
        }
      }, Oe = function(Q, se, fe) {
        var me, z;
        Re ? (me = ve.createEvent("Event"), me.promise = se, me.reason = fe, me.initEvent(Q, !1, !0), s.dispatchEvent(me)) : me = { promise: se, reason: fe }, !He && (z = s["on" + Q]) ? z(me) : Q === Ke && L("Unhandled promise rejection", fe);
      }, $e = function(Q) {
        b.call(s, function() {
          var se, fe = Q.facade, me = Q.value, z = Ce(Q);
          if (z && (se = I(function() {
            J ? Ue.emit("unhandledRejection", me, fe) : Oe(Ke, fe, me);
          }), Q.rejection = J || Ce(Q) ? re : te, se.error)) throw se.value;
        });
      }, Ce = function(Q) {
        return Q.rejection !== te && !Q.parent;
      }, ie = function(Q) {
        b.call(s, function() {
          var se = Q.facade;
          J ? Ue.emit("rejectionHandled", se) : Oe(R, se, Q.value);
        });
      }, D = function(Q, se, fe) {
        return function(me) {
          Q(se, me, fe);
        };
      }, G = function(Q, se, fe) {
        Q.done || (Q.done = !0, fe && (Q = fe), Q.value = se, Q.state = F, _e(Q, !0));
      }, Pe = function(Q, se, fe) {
        if (!Q.done) {
          Q.done = !0, fe && (Q = fe);
          try {
            if (Q.facade === se) throw Se("Promise can't be resolved itself");
            var me = ce(se);
            me ? E(function() {
              var z = { done: !1 };
              try {
                me.call(se, D(Pe, z, Q), D(G, z, Q));
              } catch (oe) {
                G(z, oe, Q);
              }
            }) : (Q.value = se, Q.state = ee, _e(Q, !1));
          } catch (z) {
            G({ done: !1 }, z, Q);
          }
        }
      };
      we && (M = function(Q) {
        y(this, M, A), m(Q), n.call(this);
        var se = T(this);
        try {
          Q(D(Pe, se), D(G, se));
        } catch (fe) {
          G(se, fe);
        }
      }, n = function(Q) {
        K(this, { type: A, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: $, value: void 0 });
      }, n.prototype = g(M.prototype, { then: function(Q, se) {
        var fe = ne(this), me = Fe(w(this, M));
        return me.ok = typeof Q != "function" || Q, me.fail = typeof se == "function" && se, me.domain = J ? Ue.domain : void 0, fe.parent = !0, fe.reactions.push(me), fe.state != $ && _e(fe, !1), me.promise;
      }, catch: function(Q) {
        return this.then(void 0, Q);
      } }), o = function() {
        var Q = new n(), se = T(Q);
        this.promise = Q, this.resolve = D(Pe, se), this.reject = D(G, se);
      }, S.f = Fe = function(Q) {
        return Q === M || Q === r ? new o(Q) : Ne(Q);
      }, u || typeof l != "function" || (t = l.prototype.then, f(l.prototype, "then", function(Q, se) {
        var fe = this;
        return new M(function(me, z) {
          t.call(fe, me, z);
        }).then(Q, se);
      }, { unsafe: !0 }), typeof Ae == "function" && a({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(Q) {
        return j(M, Ae.apply(s, arguments));
      } }))), a({ global: !0, wrap: !0, forced: we }, { Promise: M }), v(M, A, !1, !0), p(A), r = c(A), a({ target: A, stat: !0, forced: we }, { reject: function(Q) {
        var se = Fe(this);
        return se.reject.call(void 0, Q), se.promise;
      } }), a({ target: A, stat: !0, forced: u || we }, { resolve: function(Q) {
        return j(u && this === r ? M : this, Q);
      } }), a({ target: A, stat: !0, forced: he }, { all: function(Q) {
        var se = this, fe = Fe(se), me = fe.resolve, z = fe.reject, oe = I(function() {
          var le = m(se.resolve), ge = [], Ve = 0, Ge = 1;
          C(Q, function(rt) {
            var je = Ve++, it = !1;
            ge.push(void 0), Ge++, le.call(se, rt).then(function(Ze) {
              it || (it = !0, ge[je] = Ze, --Ge || me(ge));
            }, z);
          }), --Ge || me(ge);
        });
        return oe.error && z(oe.value), fe.promise;
      }, race: function(Q) {
        var se = this, fe = Fe(se), me = fe.reject, z = I(function() {
          var oe = m(se.resolve);
          C(Q, function(le) {
            oe.call(se, le).then(fe.resolve, me);
          });
        });
        return z.error && me(z.value), fe.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(a, u) {
        for (var s = o(u), c = t.f, l = r.f, f = 0; f < s.length; f++) {
          var g = s[f];
          n(a, g) || c(a, g, l(u, g));
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
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, a = e("90e3"), u = e("bb2f"), s = a("meta"), c = 0, l = Object.isExtensible || function() {
        return !0;
      }, f = function(m) {
        t(m, s, { value: { objectID: "O" + ++c, weakData: {} } });
      }, g = function(m, y) {
        if (!o(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!r(m, s)) {
          if (!l(m)) return "F";
          if (!y) return "E";
          f(m);
        }
        return m[s].objectID;
      }, v = function(m, y) {
        if (!r(m, s)) {
          if (!l(m)) return !0;
          if (!y) return !1;
          f(m);
        }
        return m[s].weakData;
      }, p = function(m) {
        return u && h.REQUIRED && l(m) && !r(m, s) && f(m), m;
      }, h = i.exports = { REQUIRED: !1, fastKey: g, getWeakData: v, onFreeze: p };
      n[s] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), a = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(s, c) {
        try {
          return s[c];
        } catch {
        }
      };
      i.exports = n ? o : function(s) {
        var c, l, f;
        return s === void 0 ? "Undefined" : s === null ? "Null" : typeof (l = u(c = Object(s), t)) == "string" ? l : a ? o(c) : (f = o(c)) == "Object" && typeof c.callee == "function" ? "Arguments" : f;
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
      function s(k, B, N, P, H, ue) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), ye = Object(t.resolveComponent)("HandBoard"), Me = Object(t.resolveComponent)("svg-icon"), We = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: k.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [k.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: B[1] || (B[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", a, [Object(t.createVNode)(pe, { data: k.resultVal, onChange: k.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [k.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: k.trigger, onChange: k.change, onTranslate: k.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), k.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ye, { key: 1, onTrigger: k.trigger, onChange: k.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), k.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: k.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(k.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Me, { "icon-class": "drag" })], 4)), [[We]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function c(k, B, N) {
        return B in k ? Object.defineProperty(k, B, { value: N, enumerable: !0, configurable: !0, writable: !0 }) : k[B] = N, k;
      }
      function l(k, B) {
        var N = Object.keys(k);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(k);
          B && (P = P.filter(function(H) {
            return Object.getOwnPropertyDescriptor(k, H).enumerable;
          })), N.push.apply(N, P);
        }
        return N;
      }
      function f(k) {
        for (var B = 1; B < arguments.length; B++) {
          var N = arguments[B] != null ? arguments[B] : {};
          B % 2 ? l(Object(N), !0).forEach(function(P) {
            c(k, P, N[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(k, Object.getOwnPropertyDescriptors(N)) : l(Object(N)).forEach(function(P) {
            Object.defineProperty(k, P, Object.getOwnPropertyDescriptor(N, P));
          });
        }
        return k;
      }
      function g(k, B) {
        (B == null || B > k.length) && (B = k.length);
        for (var N = 0, P = new Array(B); N < B; N++) P[N] = k[N];
        return P;
      }
      function v(k) {
        if (Array.isArray(k)) return g(k);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function p(k) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(k)) return Array.from(k);
      }
      e("fb6a");
      function h(k, B) {
        if (k) {
          if (typeof k == "string") return g(k, B);
          var N = Object.prototype.toString.call(k).slice(8, -1);
          return N === "Object" && k.constructor && (N = k.constructor.name), N === "Map" || N === "Set" ? Array.from(k) : N === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N) ? g(k, B) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function y(k) {
        return v(k) || p(k) || h(k) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function O(k, B) {
        if (!(k instanceof B)) throw new TypeError("Cannot call a class as a function");
      }
      function C(k, B) {
        for (var N = 0; N < B.length; N++) {
          var P = B[N];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(k, P.key, P);
        }
      }
      function x(k, B, N) {
        return B && C(k.prototype, B), k;
      }
      var w = function() {
        function k() {
          O(this, k), this.listeners = {};
        }
        return x(k, [{ key: "on", value: function(B, N) {
          var P = this, H = this.listeners[B];
          return H || (H = []), H.push(N), this.listeners[B] = H, function() {
            P.remove(B, N);
          };
        } }, { key: "emit", value: function(B) {
          var N = this.listeners[B];
          if (Array.isArray(N)) {
            for (var P = arguments.length, H = new Array(P > 1 ? P - 1 : 0), ue = 1; ue < P; ue++) H[ue - 1] = arguments[ue];
            for (var pe = 0; pe < N.length; pe++) {
              var de = N[pe];
              typeof de == "function" && de.apply(void 0, H);
            }
          }
        } }, { key: "remove", value: function(B, N) {
          if (N) {
            var P = this.listeners[B];
            if (!P) return;
            P = P.filter(function(H) {
              return H !== N;
            }), this.listeners[B] = P;
          } else this.listeners[B] = null, delete this.listeners[B];
        } }]), k;
      }(), b = new w(), E = { mounted: function(k, B, N) {
        var P = k.parentNode;
        k.onmousedown = function(H) {
          var ue = H.clientX - P.offsetLeft, pe = H.clientY - P.offsetTop;
          document.onmousemove = function(de) {
            var ye = de.clientX - ue, Me = de.clientY - pe;
            P.style.left = ye + "px", P.style.top = Me + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, k.ontouchstart = function(H) {
          var ue = H.touches[0].pageX, pe = H.touches[0].pageY, de = ue - P.offsetLeft, ye = pe - P.offsetTop;
          document.ontouchmove = function(Me) {
            var We = Me.touches[0].pageX, Qe = Me.touches[0].pageY, Je = We - de, mt = Qe - ye;
            P.style.left = Je + "px", P.style.top = mt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, j = E, L = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, I = { class: "key-board-result-show" }, W = { class: "key-board-result-show-container" }, Z = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = L(function(k, B, N, P, H, ue) {
        return k.status === "CN" || k.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: k.color } }, [k.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(k.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", I, [Object(t.createVNode)("div", W, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.showList[k.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(ye) {
            return k.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), k.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Z, [Object(t.createVNode)("span", { style: k.getStyle, onClick: B[1] || (B[1] = function() {
          return k.upper && k.upper.apply(k, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: k.getStyle, onClick: B[2] || (B[2] = function() {
          return k.lower && k.lower.apply(k, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), J = (e("1276"), e("6062"), e("5319"), function(k, B) {
        for (var N = 0, P = []; N < k.length; ) P.push(k.slice(N, N += B));
        return P;
      }), q = Symbol("KEYBOARD_CONTEXT"), U = function(k) {
        Object(t.provide)(q, k);
      }, A = function() {
        return Object(t.inject)(q);
      }, T = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(k, B) {
        var N = B.emit, P = A(), H = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), ue = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function pe() {
          ue.showIndex !== 0 && (ue.showIndex -= 1);
        }
        function de() {
          ue.showIndex !== ue.showList.length - 1 && (ue.showIndex += 1);
        }
        function ye() {
          ue.showIndex = 0, ue.showList = [], ue.valueList = [], b.emit("resultReset");
        }
        function Me(We) {
          ye(), N("change", We);
        }
        return Object(t.watch)(function() {
          return k.data;
        }, function(We) {
          var Qe;
          ue.showIndex = 0, ue.valueList = (We == null || (Qe = We.value) === null || Qe === void 0 ? void 0 : Qe.split("")) || [], ue.valueList.length !== 0 ? ue.showList = J(ue.valueList, 11) : ue.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          b.on("keyBoardChange", function(We) {
            b.emit("updateBound"), ue.status = We, ye();
          }), b.on("getWordsFromServer", function(We) {
            var Qe = Array.from(new Set(We.replace(/\s+/g, "").split("")));
            ue.valueList = Qe, ue.showList = J(Qe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          b.remove("keyBoardChange"), b.remove("getWordsFromServer");
        }), f({ color: P == null ? void 0 : P.color, upper: pe, lower: de, getStyle: H, selectWord: Me }, Object(t.toRefs)(ue));
      } });
      e("e66c"), T.render = ae, T.__scopeId = "data-v-02e63132";
      var K = T, ne = e("bc3a"), M = e.n(ne), Se = 15e3, ve = function(k) {
        M.a.defaults.baseURL = k, M.a.defaults.timeout = Se, M.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ue(k, B, N, P, H, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: k.color } }, [Object(t.createVNode)("use", { "xlink:href": k.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Ae = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(k) {
        var B = A(), N = Object(t.computed)(function() {
          return "#icon-".concat(k.iconClass);
        });
        return { color: B == null ? void 0 : B.color, iconName: N };
      } });
      e("38cd"), Ae.render = Ue;
      var Fe = Ae, Ne = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Re = { class: "hand-write-board" }, He = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Ke = Ne(function(k, B, N, P, H, ue) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Re, [Object(t.createVNode)(pe, { lib: k.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", He, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.handBoardOperList, function(ye) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: ye.type, type: ye.type, data: ye.data, isCn: k.isCn, onClick: k.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), R = { class: "paint-board" };
      function $(k, B, N, P, H, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", R, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: k.width, height: k.height, onTouchstart: B[1] || (B[1] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onTouchmove: B[2] || (B[2] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onTouchend: B[3] || (B[3] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMousedown: B[4] || (B[4] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onMousemove: B[5] || (B[5] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onMouseup: B[6] || (B[6] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMouseleave: B[7] || (B[7] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function ee(k, B, N, P, H, ue, pe) {
        try {
          var de = k[ue](pe), ye = de.value;
        } catch (Me) {
          return void N(Me);
        }
        de.done ? B(ye) : Promise.resolve(ye).then(P, H);
      }
      function F(k) {
        return function() {
          var B = this, N = arguments;
          return new Promise(function(P, H) {
            var ue = k.apply(B, N);
            function pe(ye) {
              ee(ue, P, H, pe, de, "next", ye);
            }
            function de(ye) {
              ee(ue, P, H, pe, de, "throw", ye);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var te, re, we = function() {
        var k = F(regeneratorRuntime.mark(function B(N, P, H, ue) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, M.a.post("", { lib: ue, lpXis: N, lpYis: P, lpCis: H });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, B);
        }));
        return function(B, N, P, H) {
          return k.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(k) {
        var B = A(), N = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function H() {
          return ue.apply(this, arguments);
        }
        function ue() {
          return ue = F(regeneratorRuntime.mark(function Be() {
            var Ye, qe;
            return regeneratorRuntime.wrap(function(tt) {
              for (; ; ) switch (tt.prev = tt.next) {
                case 0:
                  return tt.next = 2, we(N.clickX, N.clickY, N.clickC, k.lib);
                case 2:
                  Ye = tt.sent, qe = Ye.data, b.emit("getWordsFromServer", (qe == null ? void 0 : qe.v) || "");
                case 5:
                case "end":
                  return tt.stop();
              }
            }, Be);
          })), ue.apply(this, arguments);
        }
        function pe() {
          P.value && te && (N.clickX = [], N.clickY = [], N.clickC = [], te.clearRect(0, 0, N.width, N.height));
        }
        function de(Be) {
          if (Be.type.includes("mouse")) {
            var Ye = Be;
            return Math.floor(Ye.clientX - N.x);
          }
          if (Be.type.includes("touch")) {
            var qe, tt = Be;
            return Math.floor(((qe = tt.targetTouches[0]) === null || qe === void 0 ? void 0 : qe.clientX) - N.x);
          }
          return 0;
        }
        function ye(Be) {
          if (Be.type.includes("mouse")) {
            var Ye = Be;
            return Math.floor(Ye.clientY - N.y);
          }
          if (Be.type.includes("touch")) {
            var qe, tt = Be;
            return Math.floor(((qe = tt.targetTouches[0]) === null || qe === void 0 ? void 0 : qe.clientY) - N.y);
          }
          return 0;
        }
        function Me(Be) {
          if (te) {
            N.isMouseDown = !0;
            var Ye = de(Be), qe = ye(Be);
            clearTimeout(re), N.oldX = Ye, N.oldY = qe, te.beginPath();
          }
        }
        function We(Be) {
          if (te && (Be.preventDefault(), N.isMouseDown)) {
            var Ye = de(Be), qe = ye(Be);
            N.clickX.push(Ye), N.clickY.push(qe), N.clickC.push(0), te.strokeStyle = B == null ? void 0 : B.color, te.fillStyle = B == null ? void 0 : B.color, te.lineWidth = 4, te.lineCap = "round", te.moveTo(N.oldX, N.oldY), te.lineTo(Ye, qe), te.stroke(), N.oldX = Ye, N.oldY = qe;
          }
        }
        function Qe() {
          N.isMouseDown && (N.isMouseDown = !1, re = setTimeout(function() {
            pe();
          }, 1500), N.clickC.pop(), N.clickC.push(1), H());
        }
        function Je() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Be = document.querySelector(".paint-board").getBoundingClientRect();
              N.x = Be.x, N.y = Be.y, N.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), N.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function mt() {
          var Be;
          te = (Be = P.value) === null || Be === void 0 ? void 0 : Be.getContext("2d"), pe(), Je(), window.addEventListener("animationend", Je), window.addEventListener("resize", Je), window.addEventListener("scroll", Je);
        }
        return Object(t.onMounted)(function() {
          mt(), b.on("updateBound", function() {
            Je();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", Je), window.removeEventListener("resize", Je), window.removeEventListener("scroll", Je), b.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(N)), {}, { move: We, down: Me, mouseup: Qe, canvasRef: P });
      } });
      he.render = $;
      var ce = he;
      function _e(k, B, N, P, H, ue) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(k.type), { "key-board-button-active": k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" }], style: k.getStyle, onClick: B[1] || (B[1] = function() {
          return k.click && k.click.apply(k, arguments);
        }), onMouseenter: B[2] || (B[2] = function(de) {
          return k.isHoverStatus = !0;
        }), onMouseleave: B[3] || (B[3] = function(de) {
          return k.isHoverStatus = !1;
        }) }, [k.type === "upper" || k.type === "delete" || k.type === "handwrite" || k.type === "close" || k.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": k.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: k.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Oe = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Fe }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(k, B) {
        var N = B.emit, P = A(), H = Object(t.ref)(!1), ue = Object(t.computed)(function() {
          return k.type === "change2lang" ? k.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : k.isUpper ? k.data.toUpperCase() : k.data;
        }), pe = Object(t.computed)(function() {
          return k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" || H.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function de(ye) {
          ye.preventDefault(), N("click", { data: k.isUpper ? k.data.toUpperCase() : k.data, type: k.type });
        }
        return { isHoverStatus: H, getStyle: pe, getCode: ue, click: de };
      } });
      e("de23"), Oe.render = _e;
      var $e = Oe, Ce = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ce, KeyCodeButton: $e }, setup: function(k, B) {
        var N = B.emit, P = A(), H = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ue(pe) {
          var de = pe.data, ye = pe.type;
          switch (ye) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), b.emit("resultReset"), b.emit("keyBoardChange", H.isCn && "CN");
              break;
            case "change2lang":
              H.isCn = !H.isCn;
              break;
            case "delete":
              N("trigger", { data: de, type: ye });
              break;
          }
        }
        return f({ click: ue }, Object(t.toRefs)(H));
      } });
      e("9aaf"), Ce.render = Ke, Ce.__scopeId = "data-v-1b5e0983";
      var ie = Ce, D = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var G = { class: "default-key-board" }, Pe = { class: "line line4" };
      Object(t.popScopeId)();
      var Q = D(function(k, B, N, P, H, ue) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", G, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.lineList, function(de, ye) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ye + 1)], key: ye }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function(Me) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: k.isUpper, key: Me, type: Me, data: Me, isSymbol: k.isSymbol, onClick: k.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", Pe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: k.isCn, isNum: k.isNum, onClick: k.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), se = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, me = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, z = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: $e }, emits: ["translate", "trigger", "change"], setup: function(k, B) {
        var N = B.emit, P = A(), H = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ue() {
          var de;
          H.line4 = JSON.parse(JSON.stringify(z)), P != null && (de = P.modeList) !== null && de !== void 0 && de.find(function(ye) {
            return ye === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && H.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var ye = de.data, Me = de.type;
          switch (Me) {
            case "close":
              H.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              H.oldVal = "", H.isUpper = !H.isUpper;
              break;
            case "change2lang":
              H.isCn = !H.isCn, H.isNum || H.isSymbol || b.emit("keyBoardChange", H.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (H.isNum = !H.isNum, H.isSymbol = !1, H.isNum) {
                var We;
                b.emit("keyBoardChange", "number");
                var Qe = JSON.parse(JSON.stringify(me.line3));
                P != null && (We = P.modeList) !== null && We !== void 0 && We.find(function(Je) {
                  return Je === "symbol";
                }) || (Qe.shift(), Qe.unshift("+")), H.lineList = [me.line1, me.line2, Qe];
              } else b.emit("keyBoardChange", H.isCn ? "CN" : "EN"), H.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              H.isSymbol = !H.isSymbol, H.isSymbol ? (b.emit("keyBoardChange", "symbol"), H.lineList = [se.line1, se.line2, se.line3]) : (b.emit("keyBoardChange", "number"), H.lineList = [me.line1, me.line2, me.line3]);
              break;
            case "handwrite":
            case "delete":
              H.isCn && Me === "delete" && H.oldVal ? (H.oldVal = H.oldVal.substr(0, H.oldVal.length - 1), N("translate", H.oldVal)) : (Me === "handwrite" && b.emit("keyBoardChange", "handwrite"), N("trigger", { data: ye, type: Me }));
              break;
            default:
              !H.isCn || H.isNum || H.isSymbol ? N("change", ye) : (N("translate", H.oldVal + ye), H.oldVal = H.oldVal + ye);
              break;
          }
        }
        return ue(), Object(t.onMounted)(function() {
          b.on("resultReset", function() {
            H.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(H)), {}, { click: pe });
      } });
      e("f8b0"), oe.render = Q, oe.__scopeId = "data-v-4b78e5a1";
      var le = oe, ge = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ve = e("ec57"), Ge = function(k) {
        return k.keys().map(k);
      };
      Ge(Ve);
      var rt = [], je = null, it = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: j }, components: { Result: K, SvgIcon: Fe, HandBoard: ie, DefaultBoard: le }, setup: function(k, B) {
        var N = B.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), H = Object(t.ref)(null);
        function ue(Ee) {
          var Le, Ie;
          switch (Object(t.nextTick)(function() {
            b.emit("keyBoardChange", "CN");
          }), Ee) {
            case "en":
              P.showMode = "default", Object(t.nextTick)(function() {
                var De;
                (De = H.value) === null || De === void 0 || De.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              P.showMode = "default", Object(t.nextTick)(function() {
                var De;
                (De = H.value) === null || De === void 0 || De.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Le = k.modeList) !== null && Le !== void 0 && Le.find(function(De) {
                return De === "handwrite";
              }) && k.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                b.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Ie = k.modeList) !== null && Ie !== void 0 && Ie.find(function(De) {
                return De === "symbol";
              }) && Object(t.nextTick)(function() {
                var De, at;
                (De = H.value) === null || De === void 0 || De.click({ data: ".?123", type: "change2num" }), (at = H.value) === null || at === void 0 || at.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function pe(Ee) {
          if (P.visible = !0, je = Ee.target, ue(je.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Le = document.querySelector(".key-board-modal");
            Le.style.display = "block";
          }
        }
        function de() {
          if (je && je.blur(), je = null, P.visible = !1, N("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Ee = document.querySelector(".key-board-modal");
            Ee.style.display = "none";
          }
        }
        function ye() {
          k.closeOnClickModal && de(), N("modalClick");
        }
        function Me() {
          var Ee;
          if (document.querySelector(".key-board-modal")) {
            var Le;
            (Le = document.querySelector(".key-board-modal")) === null || Le === void 0 || Le.addEventListener("click", ye);
          } else {
            var Ie = document.createElement("div");
            Ie.className = "key-board-modal", Ie.style.display = "none", (Ee = document.querySelector("body")) === null || Ee === void 0 || Ee.appendChild(Ie), Ie.addEventListener("click", ye);
          }
        }
        function We() {
          k.handApi && ve(k.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(Ee) {
            Ee.getAttribute("data-mode") !== null && (rt.push(Ee), Ee.addEventListener("focus", pe), k.blurHide && Ee.addEventListener("blur", de));
          });
        }
        function Qe(Ee) {
          if (!je) return "";
          var Le = je, Ie = Le.selectionStart, De = Le.selectionEnd;
          if (!Ie || !De) return "";
          var at = Ee.substring(0, Ie - 1) + Ee.substring(De);
          return Le.value = at, Le.focus(), Le.selectionStart = Ie - 1, Le.selectionEnd = Ie - 1, at;
        }
        function Je(Ee) {
          var Le = Ee.type;
          switch (Le) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!je) return;
              var Ie = Qe(je.value);
              je.value = Ie, N("change", Ie, je.getAttribute("data-prop") || je);
              break;
          }
        }
        function mt(Ee, Le) {
          if (!je) return "";
          var Ie = je, De = Ie.selectionStart || 0, at = Ie.selectionEnd || 0, St = Ee.substring(0, De) + Le + Ee.substring(at);
          return Ie.value = St, Ie.focus(), Ie.selectionStart = De + Le.length, Ie.selectionEnd = De + Le.length, St;
        }
        function Be(Ee) {
          if (je) {
            var Le = mt(je.value, Ee);
            je.value = Le, N("change", Le, je.getAttribute("data-prop") || je), N("keyChange", Ee, je.getAttribute("data-prop") || je);
          }
        }
        function Ye(Ee) {
          var Le = new RegExp("^".concat(Ee, "\\w*")), Ie = Object.keys(ge).filter(function(De) {
            return Le.test(De);
          }).sort();
          P.resultVal = { code: Ee, value: Ee ? Ie.length > 1 ? Ie.reduce(function(De, at) {
            return De + ge[at];
          }, "") : ge[Ie[0]] : "" }, je && N("keyChange", Ee, je.getAttribute("data-prop") || je);
        }
        function qe() {
          We();
        }
        function tt() {
          return je;
        }
        return Object(t.onMounted)(function() {
          k.modal && Me(), We(), b.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Ee;
          (Ee = document.querySelector(".key-board-modal")) === null || Ee === void 0 || Ee.removeEventListener("click", ye), rt.forEach(function(Le) {
            Le.removeEventListener("focus", pe), Le.removeEventListener("blur", de);
          });
        }), U(Object(t.reactive)({ color: k.color, modeList: k.modeList, handApi: k.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: H, getCurrentInput: tt, translate: Ye, reSignUp: qe, trigger: Je, change: Be });
      } });
      it.render = s;
      var Ze = it;
      Ze.install = function(k) {
        k.component(Ze.name, Ze);
      };
      var yt = Ze, Pt = yt;
      d.default = Pt;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), a = e("50c4"), u = e("fc6a"), s = e("8418"), c = e("b622"), l = e("1dde"), f = l("slice"), g = c("species"), v = [].slice, p = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(h, m) {
        var y, O, C, x = u(this), w = a(x.length), b = t(h, w), E = t(m === void 0 ? w : m, w);
        if (r(x) && (y = x.constructor, typeof y != "function" || y !== Array && !r(y.prototype) ? o(y) && (y = y[g], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return v.call(x, b, E);
        for (O = new (y === void 0 ? Array : y)(p(E - b, 0)), C = 0; b < E; b++, C++) b in x && s(O, C, x[b]);
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
})(Lt);
var Lo = Lt.exports;
const At = /* @__PURE__ */ To(Lo);
$t({
  components: { KeyBoard: At },
  setup() {
    function be(Y, X) {
      console.log("change value ---->", Y), console.log("change input dom ---->", X);
    }
    return {
      change: be
    };
  }
});
const Ao = { class: "wifi-component" }, Po = { class: "row" }, No = { class: "column" }, Ro = { class: "column" }, $o = { class: "status" }, Bo = { class: "row" }, Io = { class: "column" }, Uo = {
  key: 0,
  class: "wifi-modal"
}, Do = { class: "wifi-modal-content" }, Fo = { class: "wifi-list" }, Mo = {
  key: 0,
  class: "no-wifi"
}, Vo = ["onClick"], Wo = { class: "wifi-ssid" }, qo = { class: "signal-strength" }, Ko = {
  __name: "WiFi",
  setup(be) {
    const { sendToPyQt: Y } = Xe(), X = V("未连接"), i = V("无网络"), d = V("未知"), e = V(""), n = V(""), o = V(!1), r = V([]), t = V(null), a = () => {
      Y("check_wifi_status", {});
    }, u = () => {
      t.value = setInterval(a, 5e3);
    }, s = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    dt(() => {
      u();
      const { message: h } = Xe();
      et(h, (m) => {
        if (m && m.type === "wifi_list") {
          const y = JSON.parse(m.content);
          r.value = y;
        } else if (m && m.type === "wifi_status") {
          const y = JSON.parse(m.content);
          X.value = y.wifi_name, i.value = y.internet_status, d.value = y.zerotier_ip;
        }
      });
    }), _t(() => {
      s();
    });
    const c = async () => {
      o.value = !0, r.value = [], document.body.style.overflow = "hidden", l();
    }, l = () => {
      r.value = [], Y("search_wifi", {});
    }, f = () => {
      o.value = !1, document.body.style.overflow = "auto";
    }, g = (h) => {
      e.value = h.ssid, f();
    }, v = () => {
      Y("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, p = (h, m) => {
      m.placeholder === "WiFi 名称" ? e.value = h : m.placeholder === "WiFi 密码" && (n.value = h);
    };
    return (h, m) => (xe(), ke("div", Ao, [
      _("div", Po, [
        _("div", No, [
          lt(_("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (y) => e.value = y),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [ht, e.value]
          ])
        ]),
        _("div", Ro, [
          _("div", $o, [
            ft(" WiFi: " + Te(X.value) + " | 网络: " + Te(i.value) + " ", 1),
            m[2] || (m[2] = _("br", null, null, -1)),
            ft(" zerotier ip地址: " + Te(d.value), 1)
          ])
        ])
      ]),
      _("div", Bo, [
        _("div", Io, [
          lt(_("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (y) => n.value = y),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [ht, n.value]
          ])
        ]),
        _("div", { class: "column" }, [
          _("div", { class: "button-group" }, [
            _("button", { onClick: c }, "搜索可用 WiFi"),
            _("button", { onClick: v }, "连接 WiFi")
          ])
        ])
      ]),
      ze(Bt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: p,
        class: "scaled-keyboard"
      }),
      o.value ? (xe(), ke("div", Uo, [
        _("div", Do, [
          m[4] || (m[4] = _("h2", null, "可用的WiFi网络", -1)),
          _("div", Fo, [
            r.value.length === 0 ? (xe(), ke("div", Mo, m[3] || (m[3] = [
              _("div", { class: "loading-spinner" }, null, -1),
              _("div", null, "搜索中...", -1)
            ]))) : (xe(!0), ke(ot, { key: 1 }, ct(r.value, (y) => (xe(), ke("div", {
              key: y.ssid,
              class: "wifi-item",
              onClick: (O) => g(y)
            }, [
              _("span", Wo, Te(y.ssid), 1),
              _("span", qo, "信号强度: " + Te(y.signal), 1)
            ], 8, Vo))), 128))
          ]),
          _("div", { class: "modal-buttons" }, [
            _("button", { onClick: l }, "重新搜索"),
            _("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, zo = /* @__PURE__ */ ut(Ko, [["__scopeId", "data-v-e6b1dc64"]]), Qo = {
  key: 0,
  class: "numeric-keyboard"
}, Ho = { class: "keyboard" }, Go = { class: "current-value" }, Jo = ["onClick"], Yo = {
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
  setup(be, { emit: Y }) {
    const X = be, i = Y, d = V([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = V("");
    et(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => be.showKeyboard ? (xe(), ke("div", Qo, [
      _("div", Ho, [
        _("div", Go, Te(e.value), 1),
        (xe(!0), ke(ot, null, ct(d.value, (t) => (xe(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (xe(!0), ke(ot, null, ct(t, (a) => (xe(), ke("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({ "function-key": a === "清除" || a === "确定" })
          }, Te(a), 11, Jo))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, jt = /* @__PURE__ */ ut(Yo, [["__scopeId", "data-v-2ccc1cb7"]]), Xo = { class: "container" }, Zo = { class: "column" }, er = { class: "status-bar" }, tr = ["disabled"], nr = { class: "column" }, or = {
  key: 0,
  class: "modal"
}, rr = { class: "modal-content" }, ir = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: Y }) {
    const { sendToPyQt: X } = Xe(), i = gt({
      isPyQtWebEngine: !1
    }), d = V("未激活"), e = V(0), n = V(""), o = V(""), r = V(!1), t = V(7776e3);
    let a, u;
    const s = V(0), c = V(1), l = V(null), f = V(!1), g = V(!1), v = vt(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${c.value} 次锁定 - 剩余时间: ${p.value}`), p = vt(() => {
      const J = Math.floor(e.value / 86400), q = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), U = Math.floor(e.value % (60 * 60) / 60), A = e.value % 60;
      return `${J}天 ${q.toString().padStart(2, "0")}:${U.toString().padStart(2, "0")}:${A.toString().padStart(2, "0")}`;
    }), h = vt(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function m(J) {
      d.value === "未激活" && (J.target.setPointerCapture(J.pointerId), s.value = 0, u = setInterval(() => {
        s.value += 2, s.value >= 100 && (clearInterval(u), C());
      }, 30));
    }
    function y(J) {
      J.target.releasePointerCapture(J.pointerId), O();
    }
    function O() {
      clearInterval(u), s.value = 0;
    }
    function C() {
      X("activate_device", {});
    }
    function x(J, q) {
      X("Lock_set_response", { method: "activateDevice", args: { randomCode: J, time: q } }), d.value = "已激活", n.value = J, l.value = q, w();
    }
    function w() {
      b(), a = setInterval(() => {
        e.value > 0 ? b() : E();
      }, 1e3);
    }
    function b() {
      const J = Date.now(), q = l.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((q - J) / 1e3));
    }
    function E() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(a), ae();
    }
    function j() {
      L(o.value);
    }
    function L(J) {
      X("check_lock_password", {
        target: "attemptUnlock",
        password: J,
        lockCount: c.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function S() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(a);
    }
    function I() {
      r.value = !1, document.body.style.overflow = "auto", c.value++, a && clearInterval(a), w();
    }
    _t(() => {
      clearInterval(a), clearInterval(u);
    }), dt(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: J } = Xe();
        et(J, (q) => {
          if (q && q.type === "confirm_lock_password")
            try {
              const U = JSON.parse(q.content);
              U.target === "attemptUnlock" && (U.result === "success" ? (r.value ? l.value = Date.now() : l.value = l.value + t.value * 1e3, X("update_baseTime", l.value), I(), X("Lock_set_response", { method: "extendLockTime", args: { baseTime: l.value } })) : U.result === "forever_success" ? (S(), X("Lock_set_response", { method: "permanentUnlock", args: {} })) : X("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (U) {
              console.error("Failed to parse confirm lock password :", U);
            }
          else if (q && q.type === "device_activated")
            try {
              const U = JSON.parse(q.content);
              x(U.device_random_code, U.device_base_time);
            } catch (U) {
              console.error("Failed to parse device activation result:", U);
            }
          else if (q && q.type === "device_info")
            try {
              const U = JSON.parse(q.content);
              d.value = U.device_status, n.value = U.device_random_code, c.value = U.device_lock_count, l.value = U.device_base_time, U.device_status === "已激活" ? w() : U.device_status === "永久激活" && S();
            } catch (U) {
              console.error("Failed to parse device status:", U);
            }
          else if (q && q.type === "Lock_init")
            W();
          else if (q && q.type === "Lock_set") {
            console.log("Lock_set:", q.content);
            const U = JSON.parse(q.content);
            U.method === "requestActivation" ? C() : U.method === "attemptUnlock" && L(U.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const W = () => {
      const J = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: o.value,
        isLocked: r.value,
        lockInterval: t.value,
        lockCount: c.value,
        baseTime: l.value,
        progressWidth: s.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: g.value
      };
      console.log("Sending Lock initial state:", J), X("Lock_init_response", J);
    }, Z = Y, ae = () => {
      Z("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (J, q) => (xe(), ke("div", Xo, [
      _("div", Zo, [
        _("div", er, Te(v.value), 1),
        _("button", {
          class: "activation-button",
          onPointerdown: m,
          onPointerup: y,
          onPointercancel: O,
          onPointerleave: O,
          disabled: d.value !== "未激活"
        }, [
          ft(Te(h.value) + " ", 1),
          _("div", {
            class: "progress-bar",
            style: kt({ width: s.value + "%" })
          }, null, 4)
        ], 40, tr)
      ]),
      _("div", nr, [
        lt(_("input", {
          "onUpdate:modelValue": q[0] || (q[0] = (U) => o.value = U),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: q[1] || (q[1] = (U) => f.value = !0)
        }, null, 544), [
          [ht, o.value]
        ]),
        _("button", {
          class: "unlock-button",
          onClick: j
        }, "解锁")
      ]),
      r.value ? (xe(), ke("div", or, [
        _("div", rr, [
          q[8] || (q[8] = _("h3", null, "设备已锁定", -1)),
          _("h3", null, "第 " + Te(c.value) + " 次锁定", 1),
          _("h3", null, "设备随机码: " + Te(n.value), 1),
          lt(_("input", {
            "onUpdate:modelValue": q[2] || (q[2] = (U) => o.value = U),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: q[3] || (q[3] = (U) => g.value = !0)
          }, null, 544), [
            [ht, o.value]
          ]),
          _("button", {
            class: "unlock-button",
            onClick: j
          }, "解锁")
        ])
      ])) : st("", !0),
      ze(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": q[4] || (q[4] = (U) => o.value = U),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": q[5] || (q[5] = (U) => f.value = U)
      }, null, 8, ["modelValue", "showKeyboard"]),
      ze(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": q[6] || (q[6] = (U) => o.value = U),
        showKeyboard: g.value,
        "onUpdate:showKeyboard": q[7] || (q[7] = (U) => g.value = U)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, ar = /* @__PURE__ */ ut(ir, [["__scopeId", "data-v-3d3fd364"]]), sr = { class: "app-container" }, ur = { class: "control-row" }, lr = { class: "control-item" }, cr = { class: "control-item" }, fr = {
  __name: "App",
  setup(be) {
    Ut();
    const Y = V(""), X = (i) => {
      Y.value = i;
    };
    return (i, d) => (xe(), ke("div", sr, [
      d[0] || (d[0] = _("h1", null, "涪特智能养护台车控制系统", -1)),
      ze($n),
      ze(Eo),
      ze(sn),
      _("div", ur, [
        _("div", lr, [
          ze(vo, { message: Y.value }, null, 8, ["message"])
        ]),
        _("div", cr, [
          ze(ro, { message: Y.value }, null, 8, ["message"])
        ])
      ]),
      ze(zo),
      ze(ar, { onMessageFromA: X })
    ]));
  }
};
export {
  fr as default
};
