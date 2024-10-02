import Lt, { ref as se, onMounted as ut, provide as mt, readonly as gt, inject as yt, watch as st, openBlock as Ae, createElementBlock as Le, createElementVNode as M, toDisplayString as De, Fragment as at, renderList as ct, normalizeClass as it, createCommentVNode as ft, reactive as vt, createVNode as He, onUnmounted as St, normalizeStyle as wt, defineComponent as Nt, withDirectives as dt, vModelText as pt, unref as Pt, computed as bt, createTextVNode as Bt } from "vue";
const jt = Symbol(), _t = Symbol(), Et = Symbol();
function Mt(ge, ne) {
  ge && ge.messageSignal ? ge.messageSignal.connect((te) => {
    try {
      const i = JSON.parse(te);
      ne.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), ne.value = { type: "unknown", content: te };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const ge = se(null), ne = se(null), te = se("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      ge.value = f, ne.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), Mt(ne.value, te), ne.value && typeof ne.value.vueReady == "function" ? ne.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ut(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), mt(jt, gt(ge)), mt(_t, gt(ne)), mt(Et, gt(te));
}
function rt() {
  const ge = yt(jt), ne = yt(_t), te = yt(Et);
  return (!ge || !ne || !te) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: ge,
    bridge: ne,
    message: te,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), ne && ne.value)
        if (typeof ne.value.sendToPyQt == "function")
          try {
            ne.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(ne.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ot = (ge, ne) => {
  const te = ge.__vccOpts || ge;
  for (const [i, f] of ne)
    te[i] = f;
  return te;
}, It = {
  key: 0,
  class: "numeric-keyboard"
}, Ut = { class: "keyboard" }, $t = { class: "current-value" }, Dt = ["onClick"], Ft = {
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
  setup(ge, { emit: ne }) {
    const te = ge, i = ne, f = se([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = se("");
    st(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ge.showKeyboard ? (Ae(), Le("div", It, [
      M("div", Ut, [
        M("div", $t, De(e.value), 1),
        (Ae(!0), Le(at, null, ct(f.value, (t) => (Ae(), Le("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ae(!0), Le(at, null, ct(t, (c) => (Ae(), Le("button", {
            key: c,
            onClick: (u) => n(c),
            class: it({ "function-key": c === "清除" || c === "确定" })
          }, De(c), 11, Dt))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, xt = /* @__PURE__ */ ot(Ft, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, qt = { class: "setting-group" }, zt = { class: "setting-item" }, Wt = { class: "setting-controls" }, Kt = ["value"], Qt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(ge) {
    const { sendToPyQt: ne } = rt(), te = vt({
      isPyQtWebEngine: !1
    }), i = se(30), f = se(10), e = se(80), n = se(20), r = se(!1), o = se(null), t = se("");
    ut(() => {
      if (te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: b } = rt();
        st(b, (v) => {
          if (v && v.type === "update_limit_settings")
            try {
              const p = JSON.parse(v.content);
              i.value = p.temp_upper, f.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, console.log("Sensor Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse sensor settings data:", p);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const c = (b, v) => {
      const p = b === "tempUpper" ? i : b === "tempLower" ? f : b === "humidityUpper" ? e : n;
      p.value = (p.value || 0) + v, b.startsWith("temp") ? u(b === "tempUpper" ? "upper" : "lower") : a(b === "humidityUpper" ? "upper" : "lower");
    }, u = (b) => {
      i.value === "" && (i.value = f.value + 1), f.value === "" && (f.value = i.value - 1), b === "upper" ? i.value = Math.max(f.value + 1, i.value) : f.value = Math.min(i.value - 1, f.value), s();
    }, a = (b) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), b === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), s();
    }, s = () => {
      if (i.value !== "" && f.value !== "" && e.value !== "" && n.value !== "") {
        const b = {
          temp_upper: i.value,
          temp_lower: f.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", b), te.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ne("updateLimitSettings", b)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (b) => {
      o.value = b, r.value = !0, t.value = b.startsWith("temp") ? b === "tempUpper" ? i.value : f.value : b === "humidityUpper" ? e.value : n.value;
    }, d = (b) => {
      const v = parseFloat(b);
      isNaN(v) || (o.value === "tempUpper" ? (i.value = v, u("upper")) : o.value === "tempLower" ? (f.value = v, u("lower")) : o.value === "humidityUpper" ? (e.value = v, a("upper")) : o.value === "humidityLower" && (n.value = v, a("lower"))), o.value = null;
    };
    return (b, v) => (Ae(), Le("div", Vt, [
      M("div", qt, [
        v[15] || (v[15] = M("h2", null, "温度设置 (°C)", -1)),
        M("div", zt, [
          v[13] || (v[13] = M("span", { class: "setting-label" }, "上限：", -1)),
          M("div", Wt, [
            M("button", {
              onClick: v[0] || (v[0] = (p) => c("tempUpper", -1))
            }, "-"),
            M("input", {
              type: "text",
              value: i.value,
              onFocus: v[1] || (v[1] = (p) => l("tempUpper")),
              readonly: ""
            }, null, 40, Kt),
            M("button", {
              onClick: v[2] || (v[2] = (p) => c("tempUpper", 1))
            }, "+")
          ])
        ]),
        M("div", Qt, [
          v[14] || (v[14] = M("span", { class: "setting-label" }, "下限：", -1)),
          M("div", Ht, [
            M("button", {
              onClick: v[3] || (v[3] = (p) => c("tempLower", -1))
            }, "-"),
            M("input", {
              type: "text",
              value: f.value,
              onFocus: v[4] || (v[4] = (p) => l("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            M("button", {
              onClick: v[5] || (v[5] = (p) => c("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      M("div", Yt, [
        v[18] || (v[18] = M("h2", null, "湿度设置 (%)", -1)),
        M("div", Xt, [
          v[16] || (v[16] = M("span", { class: "setting-label" }, "上限：", -1)),
          M("div", Jt, [
            M("button", {
              onClick: v[6] || (v[6] = (p) => c("humidityUpper", -1))
            }, "-"),
            M("input", {
              type: "text",
              value: e.value,
              onFocus: v[7] || (v[7] = (p) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            M("button", {
              onClick: v[8] || (v[8] = (p) => c("humidityUpper", 1))
            }, "+")
          ])
        ]),
        M("div", en, [
          v[17] || (v[17] = M("span", { class: "setting-label" }, "下限：", -1)),
          M("div", tn, [
            M("button", {
              onClick: v[9] || (v[9] = (p) => c("humidityLower", -1))
            }, "-"),
            M("input", {
              type: "text",
              value: n.value,
              onFocus: v[10] || (v[10] = (p) => l("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            M("button", {
              onClick: v[11] || (v[11] = (p) => c("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      He(xt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": d,
        "onUpdate:showKeyboard": v[12] || (v[12] = (p) => r.value = p)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, on = /* @__PURE__ */ ot(rn, [["__scopeId", "data-v-22394ea0"]]), an = { class: "sensor-data-group" }, cn = { class: "sensor-section" }, un = { class: "sensor-container" }, sn = { class: "sensor-grid" }, ln = { class: "sensor-title" }, fn = { class: "sensor-value" }, dn = { class: "sensor-section" }, pn = { class: "sensor-container" }, vn = { class: "sensor-grid" }, hn = { class: "sensor-title" }, mn = { class: "sensor-value" }, gn = {
  __name: "SensorDisplay",
  setup(ge) {
    const ne = se({ temperature: {}, humidity: {} });
    ut(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: i } = rt();
        st(i, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ne.value = JSON.parse(f.content);
            } catch (e) {
              console.error("Failed to parse sensor data:", e);
            }
        });
      } else
        console.log("在普通网页环境中执行"), te(), setInterval(te, 5e3);
    });
    const te = async () => {
      try {
        const i = await fetch("http://localhost:8000/api/sensor-data/");
        if (!i.ok)
          throw new Error(`HTTP error! status: ${i.status}`);
        const f = await i.json();
        ne.value = f;
      } catch (i) {
        console.error("Error fetching sensor data:", i);
      }
    };
    return (i, f) => (Ae(), Le("div", an, [
      M("div", cn, [
        f[0] || (f[0] = M("h2", null, "温度传感器", -1)),
        M("div", un, [
          M("div", sn, [
            (Ae(!0), Le(at, null, ct(ne.value.temperature, (e, n) => (Ae(), Le("div", {
              key: n,
              class: "sensor-card"
            }, [
              M("div", ln, De(n), 1),
              M("div", fn, De(e), 1)
            ]))), 128))
          ])
        ])
      ]),
      M("div", dn, [
        f[1] || (f[1] = M("h2", null, "湿度传感器", -1)),
        M("div", pn, [
          M("div", vn, [
            (Ae(!0), Le(at, null, ct(ne.value.humidity, (e, n) => (Ae(), Le("div", {
              key: n,
              class: "sensor-card"
            }, [
              M("div", hn, De(n), 1),
              M("div", mn, De(e), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(gn, [["__scopeId", "data-v-c19debcc"]]), bn = { class: "cart-system" }, wn = { class: "water-protection" }, xn = { class: "mode-group" }, kn = ["disabled"], On = ["disabled"], Sn = { class: "mode-content" }, jn = { key: 0 }, _n = { class: "controls" }, En = { class: "input-group" }, Cn = { class: "input-group" }, Tn = { class: "button-group" }, An = ["disabled"], Ln = ["disabled"], Nn = { class: "visualization" }, Pn = { class: "progress-bar" }, Bn = { class: "status" }, Mn = {
  key: 1,
  class: "auto-mode-container"
}, Rn = {
  __name: "CartSystem",
  setup(ge) {
    const ne = se("semi-auto"), te = se(6), i = se(12), f = se(te.value), e = se(i.value), n = se(te.value), r = se(i.value), o = se(!1), t = se(0), c = se("系统就绪"), u = se("小车尚未工作"), a = se(!1), s = se(!1), l = se(!1);
    let d = null;
    const b = se(!1), v = se(!1), { sendToPyQt: p } = rt(), h = vt({
      isPyQtWebEngine: !1
    });
    ut(() => {
      if (h.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, h.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: N } = rt();
        st(N, (_) => {
          if (_ && _.type === "update_dolly_settings")
            try {
              const T = JSON.parse(_.content);
              f.value = T.dolly_single_run_time, e.value = T.dolly_run_interval_time, n.value = f.value, r.value = e.value, console.log("dolly Settings updated:", T);
            } catch (T) {
              console.error("Failed to parse dolly settings data:", T);
            }
          else if (_ && _.type === "update_dolly_state")
            _.content ? k("小车正在运行") : k("小车尚未工作");
          else if (_ && _.type === "update_water_tank_status")
            try {
              const T = JSON.parse(_.content);
              T.side === "left" ? b.value = T.low_water : T.side === "right" && (v.value = T.low_water), b.value || v.value ? (l.value = !0, ne.value === "auto" ? (k("小车尚未工作"), p("controlDolly", { target: "setMode", mode: "semi-auto" }), y()) : O()) : (l.value = !1, ne.value === "auto" && p("controlDolly", { target: "setMode", mode: "auto" })), console.log("Water tank status updated:", T);
            } catch (T) {
              console.error("Failed to parse water tank status data:", T);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const m = (N) => {
      ne.value = N, h.isPyQtWebEngine && (N === "auto" ? (O(), p("controlDolly", { target: "setMode", mode: "auto" })) : (y(), k("小车尚未工作"), p("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, g = () => {
      f.value = Math.max(1, parseInt(f.value) || 1), n.value = f.value, C();
    }, E = () => {
      e.value = Math.max(0, parseInt(e.value) || 0), r.value = e.value, C();
    };
    function C() {
      if (h.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const N = {
          target: "dolly_settings",
          dolly_single_run_time: n.value,
          dolly_run_interval_time: r.value
        };
        p("controlDolly", N);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const w = () => {
      o.value = !0, S();
    }, O = () => {
      y(), o.value = !1, cancelAnimationFrame(d), t.value = 0, c.value = "系统就绪";
    };
    function y() {
      h.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), p("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function j() {
      h.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), p("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const S = () => {
      j(), c.value = "小车运行中", t.value = 0;
      const N = Date.now();
      te.value = n.value;
      const _ = () => {
        const T = (Date.now() - N) / 1e3, Y = Math.max(0, te.value - T);
        t.value = T / te.value * 100, c.value = `小车运行中: 剩余 ${Y.toFixed(1)} 秒`, T < te.value && o.value ? d = requestAnimationFrame(_) : o.value && (t.value = 100, y(), A());
      };
      d = requestAnimationFrame(_);
    }, A = () => {
      c.value = "等待下次运行";
      const N = Date.now();
      i.value = r.value;
      const _ = () => {
        const T = (Date.now() - N) / 1e3, Y = Math.max(0, i.value - T);
        c.value = `等待下次运行: ${Y.toFixed(1)}秒`, Y > 0 && o.value ? d = requestAnimationFrame(_) : o.value && S();
      };
      d = requestAnimationFrame(_);
    }, k = (N) => {
      u.value = N;
    };
    return St(() => {
      cancelAnimationFrame(d);
    }), (N, _) => (Ae(), Le("div", bn, [
      M("div", wn, [
        M("div", {
          class: it(["water-tank", { "low-water": b.value }])
        }, " 左水箱: " + De(b.value ? "缺水" : "正常"), 3),
        M("div", {
          class: it(["water-tank", { "low-water": v.value }])
        }, " 右水箱: " + De(v.value ? "缺水" : "正常"), 3)
      ]),
      M("div", xn, [
        M("button", {
          class: it(["mode-button", { active: ne.value === "semi-auto" && !l.value }]),
          disabled: l.value,
          onClick: _[0] || (_[0] = (T) => ne.value === "auto" ? m("semi-auto") : () => {
          })
        }, "半自动模式", 10, kn),
        M("button", {
          class: it(["mode-button", { active: ne.value === "auto" && !l.value }]),
          disabled: l.value,
          onClick: _[1] || (_[1] = (T) => ne.value === "semi-auto" ? m("auto") : () => {
          })
        }, "自动模式", 10, On)
      ]),
      M("div", Sn, [
        ne.value === "semi-auto" ? (Ae(), Le("div", jn, [
          M("div", _n, [
            M("div", En, [
              _[8] || (_[8] = M("label", null, "单次运行时间 (秒):", -1)),
              M("div", {
                class: "input-wrapper",
                onClick: _[2] || (_[2] = (T) => a.value = !0)
              }, De(f.value), 1)
            ]),
            M("div", Cn, [
              _[9] || (_[9] = M("label", null, "循环间隔时间 (秒):", -1)),
              M("div", {
                class: "input-wrapper",
                onClick: _[3] || (_[3] = (T) => s.value = !0)
              }, De(e.value), 1)
            ]),
            M("div", Tn, [
              M("button", {
                onClick: w,
                disabled: o.value || l.value
              }, "开始", 8, An),
              M("button", {
                onClick: O,
                disabled: !o.value || l.value
              }, "停止", 8, Ln)
            ])
          ]),
          M("div", Nn, [
            M("div", Pn, [
              M("div", {
                class: "progress",
                style: wt({ width: t.value + "%" })
              }, null, 4),
              M("div", {
                class: "cart",
                style: wt({ left: t.value + "%" })
              }, _[10] || (_[10] = [
                M("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          M("div", Bn, De(c.value), 1)
        ])) : (Ae(), Le("div", Mn, [
          _[11] || (_[11] = M("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          M("div", {
            class: it(["auto-mode-status", { working: u.value === "小车正在运行" }])
          }, De(u.value), 3),
          _[12] || (_[12] = M("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      He(xt, {
        modelValue: f.value,
        "onUpdate:modelValue": [
          _[4] || (_[4] = (T) => f.value = T),
          g
        ],
        showKeyboard: a.value,
        "onUpdate:showKeyboard": _[5] || (_[5] = (T) => a.value = T)
      }, null, 8, ["modelValue", "showKeyboard"]),
      He(xt, {
        modelValue: e.value,
        "onUpdate:modelValue": [
          _[6] || (_[6] = (T) => e.value = T),
          E
        ],
        showKeyboard: s.value,
        "onUpdate:showKeyboard": _[7] || (_[7] = (T) => s.value = T)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, In = /* @__PURE__ */ ot(Rn, [["__scopeId", "data-v-93c14e19"]]), Un = { class: "data-actions" }, $n = {
  key: 0,
  class: "modal-overlay"
}, Dn = {
  key: 1,
  class: "modal-overlay"
}, Fn = { class: "modal-content" }, Vn = {
  __name: "DataExport",
  setup(ge) {
    const { sendToPyQt: ne } = rt(), te = vt({
      isPyQtWebEngine: !1
    }), i = se(!1), f = se(!1), e = se("");
    ut(() => {
      te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      te.isPyQtWebEngine && (console.log("导出数据"), ne("exportData", !0));
    }, r = () => {
      i.value = !0;
    }, o = () => {
      i.value = !1;
    }, t = () => {
      console.log("清空数据"), i.value = !1, c("所有数据已清空！"), te.isPyQtWebEngine && ne("exportData", !1);
    }, c = (a) => {
      e.value = a, f.value = !0;
    }, u = () => {
      f.value = !1;
    };
    return (a, s) => (Ae(), Le("div", Un, [
      M("div", { class: "action-buttons" }, [
        M("div", { class: "button-group" }, [
          s[0] || (s[0] = M("i", { class: "fas fa-file-excel" }, null, -1)),
          M("button", {
            onClick: n,
            class: "export-btn"
          }, "导出数据")
        ]),
        M("div", { class: "button-group" }, [
          s[1] || (s[1] = M("i", { class: "fas fa-trash-alt" }, null, -1)),
          M("button", {
            onClick: r,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      i.value ? (Ae(), Le("div", $n, [
        M("div", { class: "modal-content" }, [
          s[2] || (s[2] = M("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          M("div", { class: "modal-buttons" }, [
            M("button", {
              onClick: t,
              class: "confirm-btn"
            }, "确定"),
            M("button", {
              onClick: o,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ft("", !0),
      f.value ? (Ae(), Le("div", Dn, [
        M("div", Fn, [
          M("p", null, De(e.value), 1),
          M("div", { class: "modal-buttons" }, [
            M("button", {
              onClick: u,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ft("", !0)
    ]));
  }
}, qn = /* @__PURE__ */ ot(Vn, [["__scopeId", "data-v-86824edf"]]);
var zn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wn(ge) {
  return ge && ge.__esModule && Object.prototype.hasOwnProperty.call(ge, "default") ? ge.default : ge;
}
var Ct = { exports: {} };
(function(ge, ne) {
  (function(te, i) {
    ge.exports = i(Lt);
  })(typeof self < "u" ? self : zn, function(te) {
    return function(i) {
      var f = {};
      function e(n) {
        if (f[n]) return f[n].exports;
        var r = f[n] = { i: n, l: !1, exports: {} };
        return i[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = i, e.c = f, e.d = function(n, r, o) {
        e.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: o });
      }, e.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, e.t = function(n, r) {
        if (1 & r && (n = e(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule) return n;
        var o = /* @__PURE__ */ Object.create(null);
        if (e.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string") for (var t in n) e.d(o, t, (function(c) {
          return n[c];
        }).bind(null, t));
        return o;
      }, e.n = function(n) {
        var r = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return e.d(r, "a", r), r;
      }, e.o = function(n, r) {
        return Object.prototype.hasOwnProperty.call(n, r);
      }, e.p = "", e(e.s = "fb15");
    }({ "00ee": function(i, f, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", i.exports = String(o) === "[object z]";
    }, "0366": function(i, f, e) {
      var n = e("1c0b");
      i.exports = function(r, o, t) {
        if (n(r), o === void 0) return r;
        switch (t) {
          case 0:
            return function() {
              return r.call(o);
            };
          case 1:
            return function(c) {
              return r.call(o, c);
            };
          case 2:
            return function(c, u) {
              return r.call(o, c, u);
            };
          case 3:
            return function(c, u, a) {
              return r.call(o, c, u, a);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(i, f, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], c = function(u) {
        try {
          return r(u);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(u) {
        return t && o.call(u) == "[object Window]" ? c(u) : r(n(u));
      };
    }, "06cf": function(i, f, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), c = e("c04e"), u = e("5135"), a = e("0cfb"), s = Object.getOwnPropertyDescriptor;
      f.f = n ? s : function(l, d) {
        if (l = t(l), d = c(d, !0), a) try {
          return s(l, d);
        } catch {
        }
        if (u(l, d)) return o(!r.f.call(l, d), l[d]);
      };
    }, "0a06": function(i, f, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), c = e("4a7b");
      function u(a) {
        this.defaults = a, this.interceptors = { request: new o(), response: new o() };
      }
      u.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = c(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var s = [t, void 0], l = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(d) {
          s.unshift(d.fulfilled, d.rejected);
        }), this.interceptors.response.forEach(function(d) {
          s.push(d.fulfilled, d.rejected);
        }); s.length; ) l = l.then(s.shift(), s.shift());
        return l;
      }, u.prototype.getUri = function(a) {
        return a = c(this.defaults, a), r(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        u.prototype[a] = function(s, l) {
          return this.request(c(l || {}, { method: a, url: s, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        u.prototype[a] = function(s, l, d) {
          return this.request(c(d || {}, { method: a, url: s, data: l }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, f, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, c = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, a, s, l, d, b) {
        var v = s + u.length, p = l.length, h = c;
        return d !== void 0 && (d = n(d), h = t), o.call(b, h, function(m, g) {
          var E;
          switch (g.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return a.slice(0, s);
            case "'":
              return a.slice(v);
            case "<":
              E = d[g.slice(1, -1)];
              break;
            default:
              var C = +g;
              if (C === 0) return m;
              if (C > p) {
                var w = r(C / 10);
                return w === 0 ? m : w <= p ? l[w - 1] === void 0 ? g.charAt(1) : l[w - 1] + g.charAt(1) : m;
              }
              E = l[C - 1];
          }
          return E === void 0 ? "" : E;
        });
      };
    }, "0cfb": function(i, f, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      i.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(i, f, e) {
      i.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(i, f, e) {
      var n = e("a691"), r = e("1d80");
      i.exports = "".repeat || function(o) {
        var t = String(r(this)), c = "", u = n(o);
        if (u < 0 || u == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (t += t)) 1 & u && (c += t);
        return c;
      };
    }, 1276: function(i, f, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), c = e("4840"), u = e("8aa5"), a = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), b = [].push, v = Math.min, p = 4294967295, h = !d(function() {
        return !RegExp(p, "y");
      });
      n("split", 2, function(m, g, E) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(w, O) {
          var y = String(t(this)), j = O === void 0 ? p : O >>> 0;
          if (j === 0) return [];
          if (w === void 0) return [y];
          if (!r(w)) return g.call(y, w, j);
          for (var S, A, k, N = [], _ = (w.ignoreCase ? "i" : "") + (w.multiline ? "m" : "") + (w.unicode ? "u" : "") + (w.sticky ? "y" : ""), T = 0, Y = new RegExp(w.source, _ + "g"); (S = l.call(Y, y)) && (A = Y.lastIndex, !(A > T && (N.push(y.slice(T, S.index)), S.length > 1 && S.index < y.length && b.apply(N, S.slice(1)), k = S[0].length, T = A, N.length >= j))); )
            Y.lastIndex === S.index && Y.lastIndex++;
          return T === y.length ? !k && Y.test("") || N.push("") : N.push(y.slice(T)), N.length > j ? N.slice(0, j) : N;
        } : "0".split(void 0, 0).length ? function(w, O) {
          return w === void 0 && O === 0 ? [] : g.call(this, w, O);
        } : g, [function(w, O) {
          var y = t(this), j = w == null ? void 0 : w[m];
          return j !== void 0 ? j.call(w, y, O) : C.call(String(y), w, O);
        }, function(w, O) {
          var y = E(C, w, this, O, C !== g);
          if (y.done) return y.value;
          var j = o(w), S = String(this), A = c(j, RegExp), k = j.unicode, N = (j.ignoreCase ? "i" : "") + (j.multiline ? "m" : "") + (j.unicode ? "u" : "") + (h ? "y" : "g"), _ = new A(h ? j : "^(?:" + j.source + ")", N), T = O === void 0 ? p : O >>> 0;
          if (T === 0) return [];
          if (S.length === 0) return s(_, S) === null ? [S] : [];
          for (var Y = 0, X = 0, ce = []; X < S.length; ) {
            _.lastIndex = h ? X : 0;
            var Z, L = s(_, h ? S : S.slice(X));
            if (L === null || (Z = v(a(_.lastIndex + (h ? 0 : X)), S.length)) === Y) X = u(S, X, k);
            else {
              if (ce.push(S.slice(Y, X)), ce.length === T) return ce;
              for (var P = 1; P <= L.length - 1; P++) if (ce.push(L[P]), ce.length === T) return ce;
              X = Y = Z;
            }
          }
          return ce.push(S.slice(Y)), ce;
        }];
      }, !h);
    }, "13d5": function(i, f, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), c = e("605d"), u = o("reduce"), a = !c && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || a }, { reduce: function(s) {
        return r(this, s, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, f, e) {
      var n = e("c6b6"), r = e("9263");
      i.exports = function(o, t) {
        var c = o.exec;
        if (typeof c == "function") {
          var u = c.call(o, t);
          if (typeof u != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return u;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(i, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var c in r) {
        var u = n[c], a = u && u.prototype;
        if (a && a.forEach !== o) try {
          t(a, "forEach", o);
        } catch {
          a.forEach = o;
        }
      }
    }, "17c2": function(i, f, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      i.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(i, f) {
      i.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(i, f, e) {
      var n = e("d066");
      i.exports = n("document", "documentElement");
    }, "1c0b": function(i, f) {
      i.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(i, f, e) {
      var n = e("b622"), r = n("iterator"), o = !1;
      try {
        var t = 0, c = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          o = !0;
        } };
        c[r] = function() {
          return this;
        }, Array.from(c, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(u, a) {
        if (!a && !o) return !1;
        var s = !1;
        try {
          var l = {};
          l[r] = function() {
            return { next: function() {
              return { done: s = !0 };
            } };
          }, u(l);
        } catch {
        }
        return s;
      };
    }, "1cdc": function(i, f, e) {
      var n = e("342f");
      i.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(i, f, e) {
      i.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(i, f) {
      i.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(i, f, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      i.exports = function(c) {
        return o >= 51 || !n(function() {
          var u = [], a = u.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, u[c](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, f, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          function r(I, $) {
            return $ = { exports: {} }, I($, $.exports), $.exports;
          }
          var o = r(function(I, $) {
            (function(K, F) {
              I.exports = F();
            })(0, function() {
              function K(ie) {
                var we = ie && typeof ie == "object";
                return we && Object.prototype.toString.call(ie) !== "[object RegExp]" && Object.prototype.toString.call(ie) !== "[object Date]";
              }
              function F(ie) {
                return Array.isArray(ie) ? [] : {};
              }
              function Q(ie, we) {
                var ke = we && we.clone === !0;
                return ke && K(ie) ? he(F(ie), ie, we) : ie;
              }
              function ee(ie, we, ke) {
                var Be = ie.slice();
                return we.forEach(function(Se, Ve) {
                  typeof Be[Ve] > "u" ? Be[Ve] = Q(Se, ke) : K(Se) ? Be[Ve] = he(ie[Ve], Se, ke) : ie.indexOf(Se) === -1 && Be.push(Q(Se, ke));
                }), Be;
              }
              function me(ie, we, ke) {
                var Be = {};
                return K(ie) && Object.keys(ie).forEach(function(Se) {
                  Be[Se] = Q(ie[Se], ke);
                }), Object.keys(we).forEach(function(Se) {
                  K(we[Se]) && ie[Se] ? Be[Se] = he(ie[Se], we[Se], ke) : Be[Se] = Q(we[Se], ke);
                }), Be;
              }
              function he(ie, we, ke) {
                var Be = Array.isArray(we), Se = ke || { arrayMerge: ee }, Ve = Se.arrayMerge || ee;
                return Be ? Array.isArray(ie) ? Ve(ie, we, ke) : Q(we, ke) : me(ie, we, ke);
              }
              return he.all = function(ie, we) {
                if (!Array.isArray(ie) || ie.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ie.reduce(function(ke, Be) {
                  return he(ke, Be, we);
                });
              }, he;
            });
          });
          function t(I) {
            return I = I || /* @__PURE__ */ Object.create(null), { on: function($, K) {
              (I[$] || (I[$] = [])).push(K);
            }, off: function($, K) {
              I[$] && I[$].splice(I[$].indexOf(K) >>> 0, 1);
            }, emit: function($, K) {
              (I[$] || []).map(function(F) {
                F(K);
              }), (I["*"] || []).map(function(F) {
                F($, K);
              });
            } };
          }
          var c = r(function(I, $) {
            var K = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            $.default = K, I.exports = $.default;
          }), u = function(I) {
            return Object.keys(I).map(function($) {
              var K = I[$].toString().replace(/"/g, "&quot;");
              return $ + '="' + K + '"';
            }).join(" ");
          }, a = c.svg, s = c.xlink, l = {};
          l[a.name] = a.uri, l[s.name] = s.uri;
          var d, b = function(I, $) {
            I === void 0 && (I = "");
            var K = o(l, $ || {}), F = u(K);
            return "<svg " + F + ">" + I + "</svg>";
          }, v = c.svg, p = c.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[v.name] = v.uri, d[p.name] = p.uri, d) }, m = function(I) {
            this.config = o(h, I || {}), this.symbols = [];
          };
          m.prototype.add = function(I) {
            var $ = this, K = $.symbols, F = this.find(I.id);
            return F ? (K[K.indexOf(F)] = I, !1) : (K.push(I), !0);
          }, m.prototype.remove = function(I) {
            var $ = this, K = $.symbols, F = this.find(I);
            return !!F && (K.splice(K.indexOf(F), 1), F.destroy(), !0);
          }, m.prototype.find = function(I) {
            return this.symbols.filter(function($) {
              return $.id === I;
            })[0] || null;
          }, m.prototype.has = function(I) {
            return this.find(I) !== null;
          }, m.prototype.stringify = function() {
            var I = this.config, $ = I.attrs, K = this.symbols.map(function(F) {
              return F.stringify();
            }).join("");
            return b(K, $);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(I) {
              return I.destroy();
            });
          };
          var g = function(I) {
            var $ = I.id, K = I.viewBox, F = I.content;
            this.id = $, this.viewBox = K, this.content = F;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var I = this;
            ["id", "viewBox", "content"].forEach(function($) {
              return delete I[$];
            });
          };
          var E = function(I) {
            var $ = !!document.importNode, K = new DOMParser().parseFromString(I, "image/svg+xml").documentElement;
            return $ ? document.importNode(K, !0) : K;
          }, C = function(I) {
            function $() {
              I.apply(this, arguments);
            }
            I && ($.__proto__ = I), $.prototype = Object.create(I && I.prototype), $.prototype.constructor = $;
            var K = { isMounted: {} };
            return K.isMounted.get = function() {
              return !!this.node;
            }, $.createFromExistingNode = function(F) {
              return new $({ id: F.getAttribute("id"), viewBox: F.getAttribute("viewBox"), content: F.outerHTML });
            }, $.prototype.destroy = function() {
              this.isMounted && this.unmount(), I.prototype.destroy.call(this);
            }, $.prototype.mount = function(F) {
              if (this.isMounted) return this.node;
              var Q = typeof F == "string" ? document.querySelector(F) : F, ee = this.render();
              return this.node = ee, Q.appendChild(ee), ee;
            }, $.prototype.render = function() {
              var F = this.stringify();
              return E(b(F)).childNodes[0];
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties($.prototype, K), $;
          }(g), w = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, O = function(I) {
            return Array.prototype.slice.call(I, 0);
          }, y = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, j = function(I, $) {
            var K = document.createEvent("CustomEvent");
            K.initCustomEvent(I, !1, !1, $), window.dispatchEvent(K);
          }, S = function(I) {
            var $ = [];
            return O(I.querySelectorAll("style")).forEach(function(K) {
              K.textContent += "", $.push(K);
            }), $;
          }, A = function(I) {
            return (I || window.location.href).split("#")[0];
          }, k = function(I) {
            angular.module("ng").run(["$rootScope", function($) {
              $.$on("$locationChangeSuccess", function(K, F, Q) {
                j(I, { oldUrl: Q, newUrl: F });
              });
            }]);
          }, N = "linearGradient, radialGradient, pattern, mask, clipPath", _ = function(I, $) {
            return $ === void 0 && ($ = N), O(I.querySelectorAll("symbol")).forEach(function(K) {
              O(K.querySelectorAll($)).forEach(function(F) {
                K.parentNode.insertBefore(F, K);
              });
            }), I;
          };
          function T(I, $) {
            var K = O(I).reduce(function(F, Q) {
              if (!Q.attributes) return F;
              var ee = O(Q.attributes), me = $ ? ee.filter($) : ee;
              return F.concat(me);
            }, []);
            return K;
          }
          var Y = c.xlink.uri, X = "xlink:href", ce = /[{}|\\\^\[\]`"<>]/g;
          function Z(I) {
            return I.replace(ce, function($) {
              return "%" + $[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(I) {
            return I.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function P(I, $, K) {
            return O(I).forEach(function(F) {
              var Q = F.getAttribute(X);
              if (Q && Q.indexOf($) === 0) {
                var ee = Q.replace($, K);
                F.setAttributeNS(Y, X, ee);
              }
            }), I;
          }
          var W, H = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], D = H.map(function(I) {
            return "[" + I + "]";
          }).join(","), be = function(I, $, K, F) {
            var Q = Z(K), ee = Z(F), me = I.querySelectorAll(D), he = T(me, function(ie) {
              var we = ie.localName, ke = ie.value;
              return H.indexOf(we) !== -1 && ke.indexOf("url(" + Q) !== -1;
            });
            he.forEach(function(ie) {
              return ie.value = ie.value.replace(new RegExp(L(Q), "g"), ee);
            }), P($, Q, ee);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ne = function(I) {
            function $(F) {
              var Q = this;
              F === void 0 && (F = {}), I.call(this, o(w, F));
              var ee = t();
              this._emitter = ee, this.node = null;
              var me = this, he = me.config;
              if (he.autoConfigure && this._autoConfigure(F), he.syncUrlsWithBaseTag) {
                var ie = document.getElementsByTagName("base")[0].getAttribute("href");
                ee.on(pe.MOUNT, function() {
                  return Q.updateUrls("#", ie);
                });
              }
              var we = this._handleLocationChange.bind(this);
              this._handleLocationChange = we, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, we), he.locationChangeAngularEmitter && k(he.locationChangeEvent), ee.on(pe.MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && _(ke);
              }), ee.on(pe.SYMBOL_MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && _(ke.parentNode), (y.isIE() || y.isEdge()) && S(ke);
              });
            }
            I && ($.__proto__ = I), $.prototype = Object.create(I && I.prototype), $.prototype.constructor = $;
            var K = { isMounted: {} };
            return K.isMounted.get = function() {
              return !!this.node;
            }, $.prototype._autoConfigure = function(F) {
              var Q = this, ee = Q.config;
              typeof F.syncUrlsWithBaseTag > "u" && (ee.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof F.locationChangeAngularEmitter > "u" && (ee.locationChangeAngularEmitter = typeof window.angular < "u"), typeof F.moveGradientsOutsideSymbol > "u" && (ee.moveGradientsOutsideSymbol = y.isFirefox());
            }, $.prototype._handleLocationChange = function(F) {
              var Q = F.detail, ee = Q.oldUrl, me = Q.newUrl;
              this.updateUrls(ee, me);
            }, $.prototype.add = function(F) {
              var Q = this, ee = I.prototype.add.call(this, F);
              return this.isMounted && ee && (F.mount(Q.node), this._emitter.emit(pe.SYMBOL_MOUNT, F.node)), ee;
            }, $.prototype.attach = function(F) {
              var Q = this, ee = this;
              if (ee.isMounted) return ee.node;
              var me = typeof F == "string" ? document.querySelector(F) : F;
              return ee.node = me, this.symbols.forEach(function(he) {
                he.mount(ee.node), Q._emitter.emit(pe.SYMBOL_MOUNT, he.node);
              }), O(me.querySelectorAll("symbol")).forEach(function(he) {
                var ie = C.createFromExistingNode(he);
                ie.node = he, ee.add(ie);
              }), this._emitter.emit(pe.MOUNT, me), me;
            }, $.prototype.destroy = function() {
              var F = this, Q = F.config, ee = F.symbols, me = F._emitter;
              ee.forEach(function(he) {
                return he.destroy();
              }), me.off("*"), window.removeEventListener(Q.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, $.prototype.mount = function(F, Q) {
              F === void 0 && (F = this.config.mountTo), Q === void 0 && (Q = !1);
              var ee = this;
              if (ee.isMounted) return ee.node;
              var me = typeof F == "string" ? document.querySelector(F) : F, he = ee.render();
              return this.node = he, Q && me.childNodes[0] ? me.insertBefore(he, me.childNodes[0]) : me.appendChild(he), this._emitter.emit(pe.MOUNT, he), he;
            }, $.prototype.render = function() {
              return E(this.stringify());
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, $.prototype.updateUrls = function(F, Q) {
              if (!this.isMounted) return !1;
              var ee = document.querySelectorAll(this.config.usagesToUpdate);
              return be(this.node, ee, A(F) + "#", A(Q) + "#"), !0;
            }, Object.defineProperties($.prototype, K), $;
          }(m), Pe = r(function(I) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function($, K) {
              I.exports = K();
            })(0, function() {
              var $, K = [], F = document, Q = F.documentElement.doScroll, ee = "DOMContentLoaded", me = (Q ? /^loaded|^c/ : /^loaded|^i|^c/).test(F.readyState);
              return me || F.addEventListener(ee, $ = function() {
                for (F.removeEventListener(ee, $), me = 1; $ = K.shift(); ) $();
              }), function(he) {
                me ? setTimeout(he, 0) : K.push(he);
              };
            });
          }), Re = "__SVG_SPRITE_NODE__", Ee = "__SVG_SPRITE__", Ce = !!window[Ee];
          Ce ? W = window[Ee] : (W = new Ne({ attrs: { id: Re, "aria-hidden": "true" } }), window[Ee] = W);
          var Ke = function() {
            var I = document.getElementById(Re);
            I ? W.attach(I) : W.mount(document.body, !0);
          };
          document.body ? Ke() : Pe(Ke);
          var tt = W;
          return tt;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), c = e("35a1"), u = e("2a62"), a = function(s, l) {
        this.stopped = s, this.result = l;
      };
      i.exports = function(s, l, d) {
        var b, v, p, h, m, g, E, C = d && d.that, w = !(!d || !d.AS_ENTRIES), O = !(!d || !d.IS_ITERATOR), y = !(!d || !d.INTERRUPTED), j = t(l, C, 1 + w + y), S = function(k) {
          return b && u(b), new a(!0, k);
        }, A = function(k) {
          return w ? (n(k), y ? j(k[0], k[1], S) : j(k[0], k[1])) : y ? j(k, S) : j(k);
        };
        if (O) b = s;
        else {
          if (v = c(s), typeof v != "function") throw TypeError("Target is not iterable");
          if (r(v)) {
            for (p = 0, h = o(s.length); h > p; p++) if (m = A(s[p]), m && m instanceof a) return m;
            return new a(!1);
          }
          b = v.call(s);
        }
        for (g = b.next; !(E = g.call(b)).done; ) {
          try {
            m = A(E.value);
          } catch (k) {
            throw u(b), k;
          }
          if (typeof m == "object" && m && m instanceof a) return m;
        }
        return new a(!1);
      };
    }, "23cb": function(i, f, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      i.exports = function(t, c) {
        var u = n(t);
        return u < 0 ? r(u + c, 0) : o(u, c);
      };
    }, "23e7": function(i, f, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), c = e("ce4e"), u = e("e893"), a = e("94ca");
      i.exports = function(s, l) {
        var d, b, v, p, h, m, g = s.target, E = s.global, C = s.stat;
        if (b = E ? n : C ? n[g] || c(g, {}) : (n[g] || {}).prototype, b) for (v in l) {
          if (h = l[v], s.noTargetGet ? (m = r(b, v), p = m && m.value) : p = b[v], d = a(E ? v : g + (C ? "." : "#") + v, s.forced), !d && p !== void 0) {
            if (typeof h == typeof p) continue;
            u(h, p);
          }
          (s.sham || p && p.sham) && o(h, "sham", !0), t(b, v, h, s);
        }
      };
    }, "241c": function(i, f, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      f.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(i, f, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function c(s, l) {
          !r.isUndefined(s) && r.isUndefined(s["Content-Type"]) && (s["Content-Type"] = l);
        }
        function u() {
          var s;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (s = e("b50d")), s;
        }
        var a = { adapter: u(), transformRequest: [function(s, l) {
          return o(l, "Accept"), o(l, "Content-Type"), r.isFormData(s) || r.isArrayBuffer(s) || r.isBuffer(s) || r.isStream(s) || r.isFile(s) || r.isBlob(s) ? s : r.isArrayBufferView(s) ? s.buffer : r.isURLSearchParams(s) ? (c(l, "application/x-www-form-urlencoded;charset=utf-8"), s.toString()) : r.isObject(s) ? (c(l, "application/json;charset=utf-8"), JSON.stringify(s)) : s;
        }], transformResponse: [function(s) {
          if (typeof s == "string") try {
            s = JSON.parse(s);
          } catch {
          }
          return s;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(s) {
          return s >= 200 && s < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        r.forEach(["delete", "get", "head"], function(s) {
          a.headers[s] = {};
        }), r.forEach(["post", "put", "patch"], function(s) {
          a.headers[s] = r.merge(t);
        }), i.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(i, f, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(c) {
        return !!~String(o(this)).indexOf(r(c), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, f, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), c = "toString", u = RegExp.prototype, a = u[c], s = o(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = a.name != c;
      (s || l) && n(RegExp.prototype, c, function() {
        var d = r(this), b = String(d.source), v = d.flags, p = String(v === void 0 && d instanceof RegExp && !("flags" in u) ? t.call(d) : v);
        return "/" + b + "/" + p;
      }, { unsafe: !0 });
    }, 2626: function(i, f, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), c = o("species");
      i.exports = function(u) {
        var a = n(u), s = r.f;
        t && a && !a[c] && s(a, c, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(i, f, e) {
      var n = e("825a");
      i.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(i, f, e) {
      var n, r, o, t = e("da84"), c = e("d039"), u = e("0366"), a = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), b = t.location, v = t.setImmediate, p = t.clearImmediate, h = t.process, m = t.MessageChannel, g = t.Dispatch, E = 0, C = {}, w = "onreadystatechange", O = function(A) {
        if (C.hasOwnProperty(A)) {
          var k = C[A];
          delete C[A], k();
        }
      }, y = function(A) {
        return function() {
          O(A);
        };
      }, j = function(A) {
        O(A.data);
      }, S = function(A) {
        t.postMessage(A + "", b.protocol + "//" + b.host);
      };
      v && p || (v = function(A) {
        for (var k = [], N = 1; arguments.length > N; ) k.push(arguments[N++]);
        return C[++E] = function() {
          (typeof A == "function" ? A : Function(A)).apply(void 0, k);
        }, n(E), E;
      }, p = function(A) {
        delete C[A];
      }, d ? n = function(A) {
        h.nextTick(y(A));
      } : g && g.now ? n = function(A) {
        g.now(y(A));
      } : m && !l ? (r = new m(), o = r.port2, r.port1.onmessage = j, n = u(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && b && b.protocol !== "file:" && !c(S) ? (n = S, t.addEventListener("message", j, !1)) : n = w in s("script") ? function(A) {
        a.appendChild(s("script"))[w] = function() {
          a.removeChild(this), O(A);
        };
      } : function(A) {
        setTimeout(y(A), 0);
      }), i.exports = { set: v, clear: p };
    }, "2d00": function(i, f, e) {
      var n, r, o = e("da84"), t = e("342f"), c = o.process, u = c && c.versions, a = u && u.v8;
      a ? (n = a.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), i.exports = r && +r;
    }, "2d83": function(i, f, e) {
      var n = e("387f");
      i.exports = function(r, o, t, c, u) {
        var a = new Error(r);
        return n(a, o, t, c, u);
      };
    }, "2e67": function(i, f, e) {
      i.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(i, f, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      i.exports = function(o, t, c) {
        if (!t) return o;
        var u;
        if (c) u = c(t);
        else if (n.isURLSearchParams(t)) u = t.toString();
        else {
          var a = [];
          n.forEach(t, function(l, d) {
            l !== null && typeof l < "u" && (n.isArray(l) ? d += "[]" : l = [l], n.forEach(l, function(b) {
              n.isDate(b) ? b = b.toISOString() : n.isObject(b) && (b = JSON.stringify(b)), a.push(r(d) + "=" + r(b));
            }));
          }), u = a.join("&");
        }
        if (u) {
          var s = o.indexOf("#");
          s !== -1 && (o = o.slice(0, s)), o += (o.indexOf("?") === -1 ? "?" : "&") + u;
        }
        return o;
      };
    }, "342f": function(i, f, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, f, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      i.exports = function(c) {
        if (c != null) return c[t] || c["@@iterator"] || r[n(c)];
      };
    }, "37e8": function(i, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(c, u) {
        o(c);
        for (var a, s = t(u), l = s.length, d = 0; l > d; ) r.f(c, a = s[d++], u[a]);
        return c;
      };
    }, "387f": function(i, f, e) {
      i.exports = function(n, r, o, t, c) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = c, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, f, e) {
      e("acce");
    }, 3934: function(i, f, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function c(u) {
          var a = u;
          return o && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = c(window.location.href), function(u) {
          var a = n.isString(u) ? c(u) : u;
          return a.protocol === r.protocol && a.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(i, f, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(i, f, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", c = r.set, u = r.getterFor(t);
      o(String, "String", function(a) {
        c(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, s = u(this), l = s.string, d = s.index;
        return d >= l.length ? { value: void 0, done: !0 } : (a = n(l, d), s.index += a.length, { value: a, done: !1 });
      });
    }, "3f8c": function(i, f) {
      i.exports = {};
    }, "408a": function(i, f, e) {
      var n = e("c6b6");
      i.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(i, f, e) {
      var n = e("da84");
      i.exports = n;
    }, 4362: function(i, f, e) {
      f.nextTick = function(n) {
        var r = Array.prototype.slice.call(arguments);
        r.shift(), setTimeout(function() {
          n.apply(null, r);
        }, 0);
      }, f.platform = f.arch = f.execPath = f.title = "browser", f.pid = 1, f.browser = !0, f.env = {}, f.argv = [], f.binding = function(n) {
        throw new Error("No such module. (Possibly not yet loaded)");
      }, function() {
        var n, r = "/";
        f.cwd = function() {
          return r;
        }, f.chdir = function(o) {
          n || (n = e("df7c")), r = n.resolve(o, r);
        };
      }(), f.exit = f.kill = f.umask = f.dlopen = f.uptime = f.memoryUsage = f.uvCounters = function() {
      }, f.features = {};
    }, "44ad": function(i, f, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      i.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(i, f, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), c = Array.prototype;
      c[t] == null && o.f(c, t, { configurable: !0, value: r(null) }), i.exports = function(u) {
        c[t][u] = !0;
      };
    }, "44de": function(i, f, e) {
      var n = e("da84");
      i.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(i, f, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      i.exports = function(c) {
        var u;
        return n(c) && ((u = c[t]) !== void 0 ? !!u : r(c) == "RegExp");
      };
    }, "466d": function(i, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), c = e("8aa5"), u = e("14c3");
      n("match", 1, function(a, s, l) {
        return [function(d) {
          var b = t(this), v = d == null ? void 0 : d[a];
          return v !== void 0 ? v.call(d, b) : new RegExp(d)[a](String(b));
        }, function(d) {
          var b = l(s, d, this);
          if (b.done) return b.value;
          var v = r(d), p = String(this);
          if (!v.global) return u(v, p);
          var h = v.unicode;
          v.lastIndex = 0;
          for (var m, g = [], E = 0; (m = u(v, p)) !== null; ) {
            var C = String(m[0]);
            g[E] = C, C === "" && (v.lastIndex = c(p, o(v.lastIndex), h)), E++;
          }
          return E === 0 ? null : g;
        }];
      });
    }, "467f": function(i, f, e) {
      var n = e("2d83");
      i.exports = function(r, o, t) {
        var c = t.config.validateStatus;
        t.status && c && !c(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(i, f, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      i.exports = function(c, u) {
        var a, s = n(c).constructor;
        return s === void 0 || (a = n(s)[t]) == null ? u : r(a);
      };
    }, 4930: function(i, f, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      i.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        o = o || {};
        var t = {}, c = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], s = ["validateStatus"];
        function l(p, h) {
          return n.isPlainObject(p) && n.isPlainObject(h) ? n.merge(p, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function d(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(r[p], o[p]);
        }
        n.forEach(c, function(p) {
          n.isUndefined(o[p]) || (t[p] = l(void 0, o[p]));
        }), n.forEach(u, d), n.forEach(a, function(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(void 0, o[p]);
        }), n.forEach(s, function(p) {
          p in o ? t[p] = l(r[p], o[p]) : p in r && (t[p] = l(void 0, r[p]));
        });
        var b = c.concat(u).concat(a).concat(s), v = Object.keys(r).concat(Object.keys(o)).filter(function(p) {
          return b.indexOf(p) === -1;
        });
        return n.forEach(v, d), t;
      };
    }, "4d63": function(i, f, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), c = e("9bf2").f, u = e("241c").f, a = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), b = e("d039"), v = e("69f3").set, p = e("2626"), h = e("b622"), m = h("match"), g = r.RegExp, E = g.prototype, C = /a/g, w = /a/g, O = new g(C) !== C, y = l.UNSUPPORTED_Y, j = n && o("RegExp", !O || y || b(function() {
        return w[m] = !1, g(C) != C || g(w) == w || g(C, "i") != "/a/i";
      }));
      if (j) {
        for (var S = function(_, T) {
          var Y, X = this instanceof S, ce = a(_), Z = T === void 0;
          if (!X && ce && _.constructor === S && Z) return _;
          O ? ce && !Z && (_ = _.source) : _ instanceof S && (Z && (T = s.call(_)), _ = _.source), y && (Y = !!T && T.indexOf("y") > -1, Y && (T = T.replace(/y/g, "")));
          var L = t(O ? new g(_, T) : g(_, T), X ? this : E, S);
          return y && Y && v(L, { sticky: Y }), L;
        }, A = function(_) {
          _ in S || c(S, _, { configurable: !0, get: function() {
            return g[_];
          }, set: function(T) {
            g[_] = T;
          } });
        }, k = u(g), N = 0; k.length > N; ) A(k[N++]);
        E.constructor = S, S.prototype = E, d(r, "RegExp", S);
      }
      p("RegExp");
    }, "4d64": function(i, f, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(c) {
        return function(u, a, s) {
          var l, d = n(u), b = r(d.length), v = o(s, b);
          if (c && a != a) {
            for (; b > v; ) if (l = d[v++], l != l) return !0;
          } else for (; b > v; v++) if ((c || v in d) && d[v] === a) return c || v || 0;
          return !c && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, f, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, f, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), c = e("50c4"), u = e("8418"), a = e("35a1");
      i.exports = function(s) {
        var l, d, b, v, p, h, m = r(s), g = typeof this == "function" ? this : Array, E = arguments.length, C = E > 1 ? arguments[1] : void 0, w = C !== void 0, O = a(m), y = 0;
        if (w && (C = n(C, E > 2 ? arguments[2] : void 0, 2)), O == null || g == Array && t(O)) for (l = c(m.length), d = new g(l); l > y; y++) h = w ? C(m[y], y) : m[y], u(d, y, h);
        else for (v = O.call(m), p = v.next, d = new g(); !(b = p.call(v)).done; y++) h = w ? o(v, C, [b.value, y], !0) : b.value, u(d, y, h);
        return d.length = y, d;
      };
    }, "4f43": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
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
      t.a.add(c), f.default = c;
    }, "50c4": function(i, f, e) {
      var n = e("a691"), r = Math.min;
      i.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(i, f) {
      var e = {}.hasOwnProperty;
      i.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(i, f, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function c(u) {
        u.cancelToken && u.cancelToken.throwIfRequested();
      }
      i.exports = function(u) {
        c(u), u.headers = u.headers || {}, u.data = r(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(s) {
          delete u.headers[s];
        });
        var a = u.adapter || t.adapter;
        return a(u).then(function(s) {
          return c(u), s.data = r(s.data, s.headers, u.transformResponse), s;
        }, function(s) {
          return o(s) || (c(u), s && s.response && (s.response.data = r(s.response.data, s.response.headers, u.transformResponse))), Promise.reject(s);
        });
      };
    }, 5319: function(i, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), c = e("1d80"), u = e("8aa5"), a = e("0cb2"), s = e("14c3"), l = Math.max, d = Math.min, b = function(v) {
        return v === void 0 ? v : String(v);
      };
      n("replace", 2, function(v, p, h, m) {
        var g = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, E = m.REPLACE_KEEPS_$0, C = g ? "$" : "$0";
        return [function(w, O) {
          var y = c(this), j = w == null ? void 0 : w[v];
          return j !== void 0 ? j.call(w, y, O) : p.call(String(y), w, O);
        }, function(w, O) {
          if (!g && E || typeof O == "string" && O.indexOf(C) === -1) {
            var y = h(p, w, this, O);
            if (y.done) return y.value;
          }
          var j = r(w), S = String(this), A = typeof O == "function";
          A || (O = String(O));
          var k = j.global;
          if (k) {
            var N = j.unicode;
            j.lastIndex = 0;
          }
          for (var _ = []; ; ) {
            var T = s(j, S);
            if (T === null || (_.push(T), !k)) break;
            var Y = String(T[0]);
            Y === "" && (j.lastIndex = u(S, o(j.lastIndex), N));
          }
          for (var X = "", ce = 0, Z = 0; Z < _.length; Z++) {
            T = _[Z];
            for (var L = String(T[0]), P = l(d(t(T.index), S.length), 0), W = [], H = 1; H < T.length; H++) W.push(b(T[H]));
            var D = T.groups;
            if (A) {
              var be = [L].concat(W, P, S);
              D !== void 0 && be.push(D);
              var pe = String(O.apply(void 0, be));
            } else pe = a(L, S, P, W, D, O);
            P >= ce && (X += S.slice(ce, P) + pe, ce = P + L.length);
          }
          return X + S.slice(ce);
        }];
      });
    }, "545a": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(c), f.default = c;
    }, 5530: function(i, f, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, c = o.querySelector('meta[name="viewport"]'), u = o.querySelector('meta[name="flexible"]'), a = 0, s = 0, l = r.flexible || (r.flexible = {});
        if (c) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var d = c.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          d && (s = parseFloat(d[1]), a = parseInt(1 / s));
        } else if (u) {
          var b = u.getAttribute("content");
          if (b) {
            var v = b.match(/initial\-dpr=([\d\.]+)/), p = b.match(/maximum\-dpr=([\d\.]+)/);
            v && (a = parseFloat(v[1]), s = parseFloat((1 / a).toFixed(2))), p && (a = parseFloat(p[1]), s = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !s) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          a = h ? m >= 3 && (!a || a >= 3) ? 3 : m >= 2 && (!a || a >= 2) ? 2 : 1 : 1, s = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !c) if (c = o.createElement("meta"), c.setAttribute("name", "viewport"), c.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(c);
        else {
          var g = o.createElement("div");
          g.appendChild(c), o.write(g.innerHTML);
        }
        function E() {
          var C = t.getBoundingClientRect().width, w = C / 10;
          t.style.fontSize = w + "px", l.rem = n.rem = w;
        }
        n.addEventListener("resize", function() {
          E();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && E();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), E(), l.dpr = n.dpr = a, l.refreshRem = E, l.rem2px = function(C) {
          var w = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (w += "px"), w;
        }, l.px2rem = function(C) {
          var w = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (w += "rem"), w;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, f, e) {
      var n = e("c430"), r = e("c6cd");
      (i.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, f, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(c) {
        var u = r.f(t(c)), a = o.f;
        return a ? u.concat(a(c)) : u;
      };
    }, "5a34": function(i, f, e) {
      var n = e("44e7");
      i.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(i, f) {
      i.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(i, f, e) {
      i.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(i, f, e) {
      var n = e("c6b6"), r = e("da84");
      i.exports = n(r.process) == "process";
    }, 6062: function(i, f, e) {
      var n = e("6d61"), r = e("6566");
      i.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(i, f, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(c, u) {
          var a, s, l = String(r(c)), d = n(u), b = l.length;
          return d < 0 || d >= b ? t ? "" : void 0 : (a = l.charCodeAt(d), a < 55296 || a > 56319 || d + 1 === b || (s = l.charCodeAt(d + 1)) < 56320 || s > 57343 ? t ? l.charAt(d) : a : t ? l.slice(d, d + 2) : s - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(i, f, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), c = e("19aa"), u = e("2266"), a = e("7dd0"), s = e("2626"), l = e("83ab"), d = e("f183").fastKey, b = e("69f3"), v = b.set, p = b.getterFor;
      i.exports = { getConstructor: function(h, m, g, E) {
        var C = h(function(j, S) {
          c(j, C, m), v(j, { type: m, index: r(null), first: void 0, last: void 0, size: 0 }), l || (j.size = 0), S != null && u(S, j[E], { that: j, AS_ENTRIES: g });
        }), w = p(m), O = function(j, S, A) {
          var k, N, _ = w(j), T = y(j, S);
          return T ? T.value = A : (_.last = T = { index: N = d(S, !0), key: S, value: A, previous: k = _.last, next: void 0, removed: !1 }, _.first || (_.first = T), k && (k.next = T), l ? _.size++ : j.size++, N !== "F" && (_.index[N] = T)), j;
        }, y = function(j, S) {
          var A, k = w(j), N = d(S);
          if (N !== "F") return k.index[N];
          for (A = k.first; A; A = A.next) if (A.key == S) return A;
        };
        return o(C.prototype, { clear: function() {
          for (var j = this, S = w(j), A = S.index, k = S.first; k; ) k.removed = !0, k.previous && (k.previous = k.previous.next = void 0), delete A[k.index], k = k.next;
          S.first = S.last = void 0, l ? S.size = 0 : j.size = 0;
        }, delete: function(j) {
          var S = this, A = w(S), k = y(S, j);
          if (k) {
            var N = k.next, _ = k.previous;
            delete A.index[k.index], k.removed = !0, _ && (_.next = N), N && (N.previous = _), A.first == k && (A.first = N), A.last == k && (A.last = _), l ? A.size-- : S.size--;
          }
          return !!k;
        }, forEach: function(j) {
          for (var S, A = w(this), k = t(j, arguments.length > 1 ? arguments[1] : void 0, 3); S = S ? S.next : A.first; )
            for (k(S.value, S.key, this); S && S.removed; ) S = S.previous;
        }, has: function(j) {
          return !!y(this, j);
        } }), o(C.prototype, g ? { get: function(j) {
          var S = y(this, j);
          return S && S.value;
        }, set: function(j, S) {
          return O(this, j === 0 ? 0 : j, S);
        } } : { add: function(j) {
          return O(this, j = j === 0 ? 0 : j, j);
        } }), l && n(C.prototype, "size", { get: function() {
          return w(this).size;
        } }), C;
      }, setStrong: function(h, m, g) {
        var E = m + " Iterator", C = p(m), w = p(E);
        a(h, m, function(O, y) {
          v(this, { type: E, target: O, state: C(O), kind: y, last: void 0 });
        }, function() {
          for (var O = w(this), y = O.kind, j = O.last; j && j.removed; ) j = j.previous;
          return O.target && (O.last = j = j ? j.next : O.state.first) ? y == "keys" ? { value: j.key, done: !1 } : y == "values" ? { value: j.value, done: !1 } : { value: [j.key, j.value], done: !1 } : (O.target = void 0, { value: void 0, done: !0 });
        }, g ? "entries" : "values", !g, !0), s(m);
      } };
    }, "65f0": function(i, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      i.exports = function(c, u) {
        var a;
        return r(c) && (a = c.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, f, e) {
      var n, r, o, t = e("7f9a"), c = e("da84"), u = e("861d"), a = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), b = e("d012"), v = c.WeakMap, p = function(O) {
        return o(O) ? r(O) : n(O, {});
      }, h = function(O) {
        return function(y) {
          var j;
          if (!u(y) || (j = r(y)).type !== O) throw TypeError("Incompatible receiver, " + O + " required");
          return j;
        };
      };
      if (t) {
        var m = l.state || (l.state = new v()), g = m.get, E = m.has, C = m.set;
        n = function(O, y) {
          return y.facade = O, C.call(m, O, y), y;
        }, r = function(O) {
          return g.call(m, O) || {};
        }, o = function(O) {
          return E.call(m, O);
        };
      } else {
        var w = d("state");
        b[w] = !0, n = function(O, y) {
          return y.facade = O, a(O, w, y), y;
        }, r = function(O) {
          return s(O, w) ? O[w] : {};
        }, o = function(O) {
          return s(O, w);
        };
      }
      i.exports = { set: n, get: r, has: o, enforce: p, getterFor: h };
    }, "6d55": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(c), f.default = c;
    }, "6d61": function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), c = e("f183"), u = e("2266"), a = e("19aa"), s = e("861d"), l = e("d039"), d = e("1c7e"), b = e("d44e"), v = e("7156");
      i.exports = function(p, h, m) {
        var g = p.indexOf("Map") !== -1, E = p.indexOf("Weak") !== -1, C = g ? "set" : "add", w = r[p], O = w && w.prototype, y = w, j = {}, S = function(X) {
          var ce = O[X];
          t(O, X, X == "add" ? function(Z) {
            return ce.call(this, Z === 0 ? 0 : Z), this;
          } : X == "delete" ? function(Z) {
            return !(E && !s(Z)) && ce.call(this, Z === 0 ? 0 : Z);
          } : X == "get" ? function(Z) {
            return E && !s(Z) ? void 0 : ce.call(this, Z === 0 ? 0 : Z);
          } : X == "has" ? function(Z) {
            return !(E && !s(Z)) && ce.call(this, Z === 0 ? 0 : Z);
          } : function(Z, L) {
            return ce.call(this, Z === 0 ? 0 : Z, L), this;
          });
        }, A = o(p, typeof w != "function" || !(E || O.forEach && !l(function() {
          new w().entries().next();
        })));
        if (A) y = m.getConstructor(h, p, g, C), c.REQUIRED = !0;
        else if (o(p, !0)) {
          var k = new y(), N = k[C](E ? {} : -0, 1) != k, _ = l(function() {
            k.has(1);
          }), T = d(function(X) {
            new w(X);
          }), Y = !E && l(function() {
            for (var X = new w(), ce = 5; ce--; ) X[C](ce, ce);
            return !X.has(-0);
          });
          T || (y = h(function(X, ce) {
            a(X, y, p);
            var Z = v(new w(), X, y);
            return ce != null && u(ce, Z[C], { that: Z, AS_ENTRIES: g }), Z;
          }), y.prototype = O, O.constructor = y), (_ || Y) && (S("delete"), S("has"), g && S("get")), (Y || N) && S(C), E && O.clear && delete O.clear;
        }
        return j[p] = y, n({ global: !0, forced: y != w }, j), b(y, p), E || m.setStrong(y, p, g), y;
      };
    }, "6eeb": function(i, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), c = e("8925"), u = e("69f3"), a = u.get, s = u.enforce, l = String(String).split("String");
      (i.exports = function(d, b, v, p) {
        var h, m = !!p && !!p.unsafe, g = !!p && !!p.enumerable, E = !!p && !!p.noTargetGet;
        typeof v == "function" && (typeof b != "string" || o(v, "name") || r(v, "name", b), h = s(v), h.source || (h.source = l.join(typeof b == "string" ? b : ""))), d !== n ? (m ? !E && d[b] && (g = !0) : delete d[b], g ? d[b] = v : r(d, b, v)) : g ? d[b] = v : t(b, v);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || c(this);
      });
    }, "70d3": function(i, f, e) {
    }, 7156: function(i, f, e) {
      var n = e("861d"), r = e("d2bb");
      i.exports = function(o, t, c) {
        var u, a;
        return r && typeof (u = t.constructor) == "function" && u !== c && n(a = u.prototype) && a !== c.prototype && r(o, a), o;
      };
    }, 7305: function(i, f, e) {
    }, 7320: function(i, f, e) {
    }, 7418: function(i, f) {
      f.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, f, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      i.exports = function(c) {
        var u = n.Symbol || (n.Symbol = {});
        r(u, c) || t(u, c, { value: o.f(c) });
      };
    }, 7839: function(i, f) {
      i.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(i, f, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, i.exports = n;
    }, "7aac": function(i, f, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, c, u, a) {
          var s = [];
          s.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && s.push("expires=" + new Date(t).toGMTString()), n.isString(c) && s.push("path=" + c), n.isString(u) && s.push("domain=" + u), a === !0 && s.push("secure"), document.cookie = s.join("; ");
        }, read: function(r) {
          var o = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
          return o ? decodeURIComponent(o[3]) : null;
        }, remove: function(r) {
          this.write(r, "", Date.now() - 864e5);
        } };
      }() : /* @__PURE__ */ function() {
        return { write: function() {
        }, read: function() {
          return null;
        }, remove: function() {
        } };
      }();
    }, "7b0b": function(i, f, e) {
      var n = e("1d80");
      i.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(i, f, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), c = e("d012"), u = e("1be4"), a = e("cc12"), s = e("f772"), l = ">", d = "<", b = "prototype", v = "script", p = s("IE_PROTO"), h = function() {
      }, m = function(w) {
        return d + v + l + w + d + "/" + v + l;
      }, g = function(w) {
        w.write(m("")), w.close();
        var O = w.parentWindow.Object;
        return w = null, O;
      }, E = function() {
        var w, O = a("iframe"), y = "java" + v + ":";
        return O.style.display = "none", u.appendChild(O), O.src = String(y), w = O.contentWindow.document, w.open(), w.write(m("document.F=Object")), w.close(), w.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? g(n) : E();
        for (var w = t.length; w--; ) delete C[b][t[w]];
        return C();
      };
      c[p] = !0, i.exports = Object.create || function(w, O) {
        var y;
        return w !== null ? (h[b] = r(w), y = new h(), h[b] = null, y[p] = w) : y = C(), O === void 0 ? y : o(y, O);
      };
    }, "7db0": function(i, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", c = !0;
      t in [] && Array(1)[t](function() {
        c = !1;
      }), n({ target: "Array", proto: !0, forced: c }, { find: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(i, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), c = e("d44e"), u = e("9112"), a = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), b = e("ae93"), v = b.IteratorPrototype, p = b.BUGGY_SAFARI_ITERATORS, h = s("iterator"), m = "keys", g = "values", E = "entries", C = function() {
        return this;
      };
      i.exports = function(w, O, y, j, S, A, k) {
        r(y, O, j);
        var N, _, T, Y = function(H) {
          if (H === S && P) return P;
          if (!p && H in Z) return Z[H];
          switch (H) {
            case m:
              return function() {
                return new y(this, H);
              };
            case g:
              return function() {
                return new y(this, H);
              };
            case E:
              return function() {
                return new y(this, H);
              };
          }
          return function() {
            return new y(this);
          };
        }, X = O + " Iterator", ce = !1, Z = w.prototype, L = Z[h] || Z["@@iterator"] || S && Z[S], P = !p && L || Y(S), W = O == "Array" && Z.entries || L;
        if (W && (N = o(W.call(new w())), v !== Object.prototype && N.next && (l || o(N) === v || (t ? t(N, v) : typeof N[h] != "function" && u(N, h, C)), c(N, X, !0, !0), l && (d[X] = C))), S == g && L && L.name !== g && (ce = !0, P = function() {
          return L.call(this);
        }), l && !k || Z[h] === P || u(Z, h, P), d[O] = P, S) if (_ = { values: Y(g), keys: A ? P : Y(m), entries: Y(E) }, k) for (T in _) (p || ce || !(T in Z)) && a(Z, T, _[T]);
        else n({ target: O, proto: !0, forced: p || ce }, _);
        return _;
      };
    }, "7eb5": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(c), f.default = c;
    }, "7f9a": function(i, f, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      i.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(i, f, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(i, f, e) {
      var n = e("d925"), r = e("e683");
      i.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(i, f, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      i.exports = function(t, c, u) {
        var a = n(c);
        a in t ? r.f(t, a, o(0, u)) : t[a] = u;
      };
    }, "861d": function(i, f) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, f, e) {
      var n, r, o;
      (function(t, c) {
        r = [], n = c, o = typeof n == "function" ? n.apply(f, r) : n, o === void 0 || (i.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var c = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!c && "currentScript" in document && document.currentScript || c && c.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (E) {
            var u, a, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, b = l.exec(E.stack) || d.exec(E.stack), v = b && b[1] || !1, p = b && b[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            v === h && (u = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (p - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = u.replace(a, "$1").trim());
            for (var g = 0; g < m.length; g++)
              if (m[g].readyState === "interactive" || m[g].src === v || v === h && m[g].innerHTML && m[g].innerHTML.trim() === s) return m[g];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(i, f, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), i.exports = n.inspectSource;
    }, "8aa5": function(i, f, e) {
      var n = e("6547").charAt;
      i.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(i, f) {
      i.exports = te;
    }, "8df4": function(i, f, e) {
      var n = e("7a77");
      function r(o) {
        if (typeof o != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(u) {
          t = u;
        });
        var c = this;
        o(function(u) {
          c.reason || (c.reason = new n(u), t(c.reason));
        });
      }
      r.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, r.source = function() {
        var o, t = new r(function(c) {
          o = c;
        });
        return { token: t, cancel: o };
      }, i.exports = r;
    }, "90e3": function(i, f) {
      var e = 0, n = Math.random();
      i.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(i, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      i.exports = n ? function(t, c, u) {
        return r.f(t, c, o(1, u));
      } : function(t, c, u) {
        return t[c] = u, t;
      };
    }, 9263: function(i, f, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, c = o, u = function() {
        var d = /a/, b = /b*/g;
        return o.call(d, "a"), o.call(b, "a"), d.lastIndex !== 0 || b.lastIndex !== 0;
      }(), a = r.UNSUPPORTED_Y || r.BROKEN_CARET, s = /()??/.exec("")[1] !== void 0, l = u || s || a;
      l && (c = function(d) {
        var b, v, p, h, m = this, g = a && m.sticky, E = n.call(m), C = m.source, w = 0, O = d;
        return g && (E = E.replace("y", ""), E.indexOf("g") === -1 && (E += "g"), O = String(d).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && d[m.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", O = " " + O, w++), v = new RegExp("^(?:" + C + ")", E)), s && (v = new RegExp("^" + C + "$(?!\\s)", E)), u && (b = m.lastIndex), p = o.call(g ? v : m, O), g ? p ? (p.input = p.input.slice(w), p[0] = p[0].slice(w), p.index = m.lastIndex, m.lastIndex += p[0].length) : m.lastIndex = 0 : u && p && (m.lastIndex = m.global ? p.index + p[0].length : b), s && p && p.length > 1 && t.call(p[0], v, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (p[h] = void 0);
        }), p;
      }), i.exports = c;
    }, "94ca": function(i, f, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(s, l) {
        var d = c[t(s)];
        return d == a || d != u && (typeof l == "function" ? n(l) : !!l);
      }, t = o.normalize = function(s) {
        return String(s).replace(r, ".").toLowerCase();
      }, c = o.data = {}, u = o.NATIVE = "N", a = o.POLYFILL = "P";
      i.exports = o;
    }, "95d9": function(i, f, e) {
    }, "96cf": function(i, f) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, c = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", s = typeof i == "object", l = e.regeneratorRuntime;
        if (l) s && (i.exports = l);
        else {
          l = e.regeneratorRuntime = s ? i.exports : {}, l.wrap = w;
          var d = "suspendedStart", b = "suspendedYield", v = "executing", p = "completed", h = {}, m = {};
          m[c] = function() {
            return this;
          };
          var g = Object.getPrototypeOf, E = g && g(g(ce([])));
          E && E !== r && o.call(E, c) && (m = E);
          var C = S.prototype = y.prototype = Object.create(m);
          j.prototype = C.constructor = S, S.constructor = j, S[a] = j.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var P = typeof L == "function" && L.constructor;
            return !!P && (P === j || (P.displayName || P.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, S) : (L.__proto__ = S, a in L || (L[a] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, A(k.prototype), k.prototype[u] = function() {
            return this;
          }, l.AsyncIterator = k, l.async = function(L, P, W, H) {
            var D = new k(w(L, P, W, H));
            return l.isGeneratorFunction(P) ? D : D.next().then(function(be) {
              return be.done ? be.value : D.next();
            });
          }, A(C), C[a] = "Generator", C[c] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var P = [];
            for (var W in L) P.push(W);
            return P.reverse(), function H() {
              for (; P.length; ) {
                var D = P.pop();
                if (D in L) return H.value = D, H.done = !1, H;
              }
              return H.done = !0, H;
            };
          }, l.values = ce, X.prototype = { constructor: X, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(Y), !L) for (var P in this) P.charAt(0) === "t" && o.call(this, P) && !isNaN(+P.slice(1)) && (this[P] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], P = L.completion;
            if (P.type === "throw") throw P.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var P = this;
            function W(Pe, Re) {
              return be.type = "throw", be.arg = L, P.next = Pe, Re && (P.method = "next", P.arg = n), !!Re;
            }
            for (var H = this.tryEntries.length - 1; H >= 0; --H) {
              var D = this.tryEntries[H], be = D.completion;
              if (D.tryLoc === "root") return W("end");
              if (D.tryLoc <= this.prev) {
                var pe = o.call(D, "catchLoc"), Ne = o.call(D, "finallyLoc");
                if (pe && Ne) {
                  if (this.prev < D.catchLoc) return W(D.catchLoc, !0);
                  if (this.prev < D.finallyLoc) return W(D.finallyLoc);
                } else if (pe) {
                  if (this.prev < D.catchLoc) return W(D.catchLoc, !0);
                } else {
                  if (!Ne) throw new Error("try statement without catch or finally");
                  if (this.prev < D.finallyLoc) return W(D.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, P) {
            for (var W = this.tryEntries.length - 1; W >= 0; --W) {
              var H = this.tryEntries[W];
              if (H.tryLoc <= this.prev && o.call(H, "finallyLoc") && this.prev < H.finallyLoc) {
                var D = H;
                break;
              }
            }
            D && (L === "break" || L === "continue") && D.tryLoc <= P && P <= D.finallyLoc && (D = null);
            var be = D ? D.completion : {};
            return be.type = L, be.arg = P, D ? (this.method = "next", this.next = D.finallyLoc, h) : this.complete(be);
          }, complete: function(L, P) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && P && (this.next = P), h;
          }, finish: function(L) {
            for (var P = this.tryEntries.length - 1; P >= 0; --P) {
              var W = this.tryEntries[P];
              if (W.finallyLoc === L) return this.complete(W.completion, W.afterLoc), Y(W), h;
            }
          }, catch: function(L) {
            for (var P = this.tryEntries.length - 1; P >= 0; --P) {
              var W = this.tryEntries[P];
              if (W.tryLoc === L) {
                var H = W.completion;
                if (H.type === "throw") {
                  var D = H.arg;
                  Y(W);
                }
                return D;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, P, W) {
            return this.delegate = { iterator: ce(L), resultName: P, nextLoc: W }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function w(L, P, W, H) {
          var D = P && P.prototype instanceof y ? P : y, be = Object.create(D.prototype), pe = new X(H || []);
          return be._invoke = N(L, W, pe), be;
        }
        function O(L, P, W) {
          try {
            return { type: "normal", arg: L.call(P, W) };
          } catch (H) {
            return { type: "throw", arg: H };
          }
        }
        function y() {
        }
        function j() {
        }
        function S() {
        }
        function A(L) {
          ["next", "throw", "return"].forEach(function(P) {
            L[P] = function(W) {
              return this._invoke(P, W);
            };
          });
        }
        function k(L) {
          function P(D, be, pe, Ne) {
            var Pe = O(L[D], L, be);
            if (Pe.type !== "throw") {
              var Re = Pe.arg, Ee = Re.value;
              return Ee && typeof Ee == "object" && o.call(Ee, "__await") ? Promise.resolve(Ee.__await).then(function(Ce) {
                P("next", Ce, pe, Ne);
              }, function(Ce) {
                P("throw", Ce, pe, Ne);
              }) : Promise.resolve(Ee).then(function(Ce) {
                Re.value = Ce, pe(Re);
              }, Ne);
            }
            Ne(Pe.arg);
          }
          var W;
          function H(D, be) {
            function pe() {
              return new Promise(function(Ne, Pe) {
                P(D, be, Ne, Pe);
              });
            }
            return W = W ? W.then(pe, pe) : pe();
          }
          this._invoke = H;
        }
        function N(L, P, W) {
          var H = d;
          return function(D, be) {
            if (H === v) throw new Error("Generator is already running");
            if (H === p) {
              if (D === "throw") throw be;
              return Z();
            }
            for (W.method = D, W.arg = be; ; ) {
              var pe = W.delegate;
              if (pe) {
                var Ne = _(pe, W);
                if (Ne) {
                  if (Ne === h) continue;
                  return Ne;
                }
              }
              if (W.method === "next") W.sent = W._sent = W.arg;
              else if (W.method === "throw") {
                if (H === d) throw H = p, W.arg;
                W.dispatchException(W.arg);
              } else W.method === "return" && W.abrupt("return", W.arg);
              H = v;
              var Pe = O(L, P, W);
              if (Pe.type === "normal") {
                if (H = W.done ? p : b, Pe.arg === h) continue;
                return { value: Pe.arg, done: W.done };
              }
              Pe.type === "throw" && (H = p, W.method = "throw", W.arg = Pe.arg);
            }
          };
        }
        function _(L, P) {
          var W = L.iterator[P.method];
          if (W === n) {
            if (P.delegate = null, P.method === "throw") {
              if (L.iterator.return && (P.method = "return", P.arg = n, _(L, P), P.method === "throw")) return h;
              P.method = "throw", P.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var H = O(W, L.iterator, P.arg);
          if (H.type === "throw") return P.method = "throw", P.arg = H.arg, P.delegate = null, h;
          var D = H.arg;
          return D ? D.done ? (P[L.resultName] = D.value, P.next = L.nextLoc, P.method !== "return" && (P.method = "next", P.arg = n), P.delegate = null, h) : D : (P.method = "throw", P.arg = new TypeError("iterator result is not an object"), P.delegate = null, h);
        }
        function T(L) {
          var P = { tryLoc: L[0] };
          1 in L && (P.catchLoc = L[1]), 2 in L && (P.finallyLoc = L[2], P.afterLoc = L[3]), this.tryEntries.push(P);
        }
        function Y(L) {
          var P = L.completion || {};
          P.type = "normal", delete P.arg, L.completion = P;
        }
        function X(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(T, this), this.reset(!0);
        }
        function ce(L) {
          if (L) {
            var P = L[c];
            if (P) return P.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var W = -1, H = function D() {
                for (; ++W < L.length; ) if (o.call(L, W)) return D.value = L[W], D.done = !1, D;
                return D.value = n, D.done = !0, D;
              };
              return H.next = H;
            }
          }
          return { next: Z };
        }
        function Z() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), c = e("7b0b"), u = e("50c4"), a = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), b = e("2d00"), v = d("isConcatSpreadable"), p = 9007199254740991, h = "Maximum allowed index exceeded", m = b >= 51 || !r(function() {
        var w = [];
        return w[v] = !1, w.concat()[0] !== w;
      }), g = l("concat"), E = function(w) {
        if (!t(w)) return !1;
        var O = w[v];
        return O !== void 0 ? !!O : o(w);
      }, C = !m || !g;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(w) {
        var O, y, j, S, A, k = c(this), N = s(k, 0), _ = 0;
        for (O = -1, j = arguments.length; O < j; O++) if (A = O === -1 ? k : arguments[O], E(A)) {
          if (S = u(A.length), _ + S > p) throw TypeError(h);
          for (y = 0; y < S; y++, _++) y in A && a(N, _, A[y]);
        } else {
          if (_ >= p) throw TypeError(h);
          a(N, _++, A);
        }
        return N.length = _, N;
      } });
    }, "9aaf": function(i, f, e) {
      e("70d3");
    }, "9bdd": function(i, f, e) {
      var n = e("825a"), r = e("2a62");
      i.exports = function(o, t, c, u) {
        try {
          return u ? t(n(c)[0], c[1]) : t(c);
        } catch (a) {
          throw r(o), a;
        }
      };
    }, "9bf2": function(i, f, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), c = Object.defineProperty;
      f.f = n ? c : function(u, a, s) {
        if (o(u), a = t(a, !0), o(s), r) try {
          return c(u, a, s);
        } catch {
        }
        if ("get" in s || "set" in s) throw TypeError("Accessors not supported");
        return "value" in s && (u[a] = s.value), u;
      };
    }, "9ed3": function(i, f, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), c = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(a, s, l) {
        var d = s + " Iterator";
        return a.prototype = r(n, { next: o(1, l) }), t(a, d, !1, !0), c[d] = u, a;
      };
    }, "9f7f": function(i, f, e) {
      var n = e("d039");
      function r(o, t) {
        return RegExp(o, t);
      }
      f.UNSUPPORTED_Y = n(function() {
        var o = r("a", "y");
        return o.lastIndex = 2, o.exec("abcd") != null;
      }), f.BROKEN_CARET = n(function() {
        var o = r("^r", "gy");
        return o.lastIndex = 2, o.exec("str") != null;
      });
    }, a434: function(i, f, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), c = e("7b0b"), u = e("65f0"), a = e("8418"), s = e("1dde"), l = s("splice"), d = Math.max, b = Math.min, v = 9007199254740991, p = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, m) {
        var g, E, C, w, O, y, j = c(this), S = t(j.length), A = r(h, S), k = arguments.length;
        if (k === 0 ? g = E = 0 : k === 1 ? (g = 0, E = S - A) : (g = k - 2, E = b(d(o(m), 0), S - A)), S + g - E > v) throw TypeError(p);
        for (C = u(j, E), w = 0; w < E; w++) O = A + w, O in j && a(C, w, j[O]);
        if (C.length = E, g < E) {
          for (w = A; w < S - E; w++) O = w + E, y = w + g, O in j ? j[y] = j[O] : delete j[y];
          for (w = S; w > S - E + g; w--) delete j[w - 1];
        } else if (g > E) for (w = S - E; w > A; w--) O = w + E - 1, y = w + g - 1, O in j ? j[y] = j[O] : delete j[y];
        for (w = 0; w < g; w++) j[w + A] = arguments[w + 2];
        return j.length = S - E + g, C;
      } });
    }, a4b4: function(i, f, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), c = e("83ab"), u = e("4930"), a = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), b = e("861d"), v = e("825a"), p = e("7b0b"), h = e("fc6a"), m = e("c04e"), g = e("5c6c"), E = e("7c73"), C = e("df75"), w = e("241c"), O = e("057f"), y = e("7418"), j = e("06cf"), S = e("9bf2"), A = e("d1e7"), k = e("9112"), N = e("6eeb"), _ = e("5692"), T = e("f772"), Y = e("d012"), X = e("90e3"), ce = e("b622"), Z = e("e538"), L = e("746f"), P = e("d44e"), W = e("69f3"), H = e("b727").forEach, D = T("hidden"), be = "Symbol", pe = "prototype", Ne = ce("toPrimitive"), Pe = W.set, Re = W.getterFor(be), Ee = Object[pe], Ce = r.Symbol, Ke = o("JSON", "stringify"), tt = j.f, I = S.f, $ = O.f, K = A.f, F = _("symbols"), Q = _("op-symbols"), ee = _("string-to-symbol-registry"), me = _("symbol-to-string-registry"), he = _("wks"), ie = r.QObject, we = !ie || !ie[pe] || !ie[pe].findChild, ke = c && s(function() {
        return E(I({}, "a", { get: function() {
          return I(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(V, G, oe) {
        var de = tt(Ee, G);
        de && delete Ee[G], I(V, G, oe), de && V !== Ee && I(Ee, G, de);
      } : I, Be = function(V, G) {
        var oe = F[V] = E(Ce[pe]);
        return Pe(oe, { type: be, tag: V, description: G }), c || (oe.description = G), oe;
      }, Se = a ? function(V) {
        return typeof V == "symbol";
      } : function(V) {
        return Object(V) instanceof Ce;
      }, Ve = function(V, G, oe) {
        V === Ee && Ve(Q, G, oe), v(V);
        var de = m(G, !0);
        return v(oe), l(F, de) ? (oe.enumerable ? (l(V, D) && V[D][de] && (V[D][de] = !1), oe = E(oe, { enumerable: g(0, !1) })) : (l(V, D) || I(V, D, g(1, {})), V[D][de] = !0), ke(V, de, oe)) : I(V, de, oe);
      }, Ge = function(V, G) {
        v(V);
        var oe = h(G), de = C(oe).concat(ue(oe));
        return H(de, function(Ie) {
          c && !nt.call(oe, Ie) || Ve(V, Ie, oe[Ie]);
        }), V;
      }, Xe = function(V, G) {
        return G === void 0 ? E(V) : Ge(E(V), G);
      }, nt = function(V) {
        var G = m(V, !0), oe = K.call(this, G);
        return !(this === Ee && l(F, G) && !l(Q, G)) && (!(oe || !l(this, G) || !l(F, G) || l(this, D) && this[D][G]) || oe);
      }, q = function(V, G) {
        var oe = h(V), de = m(G, !0);
        if (oe !== Ee || !l(F, de) || l(Q, de)) {
          var Ie = tt(oe, de);
          return !Ie || !l(F, de) || l(oe, D) && oe[D][de] || (Ie.enumerable = !0), Ie;
        }
      }, J = function(V) {
        var G = $(h(V)), oe = [];
        return H(G, function(de) {
          l(F, de) || l(Y, de) || oe.push(de);
        }), oe;
      }, ue = function(V) {
        var G = V === Ee, oe = $(G ? Q : h(V)), de = [];
        return H(oe, function(Ie) {
          !l(F, Ie) || G && !l(Ee, Ie) || de.push(F[Ie]);
        }), de;
      };
      if (u || (Ce = function() {
        if (this instanceof Ce) throw TypeError("Symbol is not a constructor");
        var V = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, G = X(V), oe = function(de) {
          this === Ee && oe.call(Q, de), l(this, D) && l(this[D], G) && (this[D][G] = !1), ke(this, G, g(1, de));
        };
        return c && we && ke(Ee, G, { configurable: !0, set: oe }), Be(G, V);
      }, N(Ce[pe], "toString", function() {
        return Re(this).tag;
      }), N(Ce, "withoutSetter", function(V) {
        return Be(X(V), V);
      }), A.f = nt, S.f = Ve, j.f = q, w.f = O.f = J, y.f = ue, Z.f = function(V) {
        return Be(ce(V), V);
      }, c && (I(Ce[pe], "description", { configurable: !0, get: function() {
        return Re(this).description;
      } }), t || N(Ee, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Ce }), H(C(he), function(V) {
        L(V);
      }), n({ target: be, stat: !0, forced: !u }, { for: function(V) {
        var G = String(V);
        if (l(ee, G)) return ee[G];
        var oe = Ce(G);
        return ee[G] = oe, me[oe] = G, oe;
      }, keyFor: function(V) {
        if (!Se(V)) throw TypeError(V + " is not a symbol");
        if (l(me, V)) return me[V];
      }, useSetter: function() {
        we = !0;
      }, useSimple: function() {
        we = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !c }, { create: Xe, defineProperty: Ve, defineProperties: Ge, getOwnPropertyDescriptor: q }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: J, getOwnPropertySymbols: ue }), n({ target: "Object", stat: !0, forced: s(function() {
        y.f(1);
      }) }, { getOwnPropertySymbols: function(V) {
        return y.f(p(V));
      } }), Ke) {
        var fe = !u || s(function() {
          var V = Ce();
          return Ke([V]) != "[null]" || Ke({ a: V }) != "{}" || Ke(Object(V)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: fe }, { stringify: function(V, G, oe) {
          for (var de, Ie = [V], qe = 1; arguments.length > qe; ) Ie.push(arguments[qe++]);
          if (de = G, (b(G) || V !== void 0) && !Se(V)) return d(G) || (G = function(Je, ye) {
            if (typeof de == "function" && (ye = de.call(this, Je, ye)), !Se(ye)) return ye;
          }), Ie[1] = G, Ke.apply(null, Ie);
        } });
      }
      Ce[pe][Ne] || k(Ce[pe], Ne, Ce[pe].valueOf), P(Ce, be), Y[D] = !0;
    }, a630: function(i, f, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(c) {
        Array.from(c);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(i, f, e) {
      var n = e("d039");
      i.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(i, f) {
      var e = Math.ceil, n = Math.floor;
      i.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(i, f, e) {
      var n = e("b622"), r = n("match");
      i.exports = function(o) {
        var t = /./;
        try {
          "/./"[o](t);
        } catch {
          try {
            return t[r] = !1, "/./"[o](t);
          } catch {
          }
        }
        return !1;
      };
    }, ac1f: function(i, f, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(i, f, e) {
    }, ad6d: function(i, f, e) {
      var n = e("825a");
      i.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(i, f, e) {
      var n, r, o, t = e("d039"), c = e("e163"), u = e("9112"), a = e("5135"), s = e("b622"), l = e("c430"), d = s("iterator"), b = !1, v = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = c(c(o)), r !== Object.prototype && (n = r)) : b = !0);
      var p = n == null || t(function() {
        var h = {};
        return n[d].call(h) !== h;
      });
      p && (n = {}), l && !p || a(n, d) || u(n, d, v), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: b };
    }, b041: function(i, f, e) {
      var n = e("00ee"), r = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(i, f, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, c = /^\s*function ([^ (]*)/, u = "name";
      n && !(u in o) && r(o, u, { configurable: !0, get: function() {
        try {
          return t.call(this).match(c)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, f, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), c = e("83b9"), u = e("c345"), a = e("3934"), s = e("2d83");
      i.exports = function(l) {
        return new Promise(function(d, b) {
          var v = l.data, p = l.headers;
          n.isFormData(v) && delete p["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", g = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            p.Authorization = "Basic " + btoa(m + ":" + g);
          }
          var E = c(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(E, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var w = "getAllResponseHeaders" in h ? u(h.getAllResponseHeaders()) : null, O = l.responseType && l.responseType !== "text" ? h.response : h.responseText, y = { data: O, status: h.status, statusText: h.statusText, headers: w, config: l, request: h };
              r(d, b, y), h = null;
            }
          }, h.onabort = function() {
            h && (b(s("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            b(s("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var w = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (w = l.timeoutErrorMessage), b(s(w, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (l.withCredentials || a(E)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            C && (p[l.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(p, function(w, O) {
            typeof v > "u" && O.toLowerCase() === "content-type" ? delete p[O] : h.setRequestHeader(O, w);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (w) {
            if (l.responseType !== "json") throw w;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(w) {
            h && (h.abort(), b(w), h = null);
          }), v || (v = null), h.send(v);
        });
      };
    }, b575: function(i, f, e) {
      var n, r, o, t, c, u, a, s, l = e("da84"), d = e("06cf").f, b = e("2cf4").set, v = e("1cdc"), p = e("a4b4"), h = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, g = l.document, E = l.process, C = l.Promise, w = d(l, "queueMicrotask"), O = w && w.value;
      O || (n = function() {
        var y, j;
        for (h && (y = E.domain) && y.exit(); r; ) {
          j = r.fn, r = r.next;
          try {
            j();
          } catch (S) {
            throw r ? t() : o = void 0, S;
          }
        }
        o = void 0, y && y.enter();
      }, v || h || p || !m || !g ? C && C.resolve ? (a = C.resolve(void 0), s = a.then, t = function() {
        s.call(a, n);
      }) : t = h ? function() {
        E.nextTick(n);
      } : function() {
        b.call(l, n);
      } : (c = !0, u = g.createTextNode(""), new m(n).observe(u, { characterData: !0 }), t = function() {
        u.data = c = !c;
      })), i.exports = O || function(y) {
        var j = { fn: y, next: void 0 };
        o && (o.next = j), r || (r = j, t()), o = j;
      };
    }, b622: function(i, f, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), c = e("4930"), u = e("fdbf"), a = r("wks"), s = n.Symbol, l = u ? s : s && s.withoutSetter || t;
      i.exports = function(d) {
        return o(a, d) && (c || typeof a[d] == "string") || (c && o(s, d) ? a[d] = s[d] : a[d] = l("Symbol." + d)), a[d];
      };
    }, b64b: function(i, f, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), c = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: c }, { keys: function(u) {
        return o(r(u));
      } });
    }, b680: function(i, f, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), c = e("d039"), u = 1 .toFixed, a = Math.floor, s = function(h, m, g) {
        return m === 0 ? g : m % 2 === 1 ? s(h, m - 1, g * h) : s(h * h, m / 2, g);
      }, l = function(h) {
        for (var m = 0, g = h; g >= 4096; ) m += 12, g /= 4096;
        for (; g >= 2; ) m += 1, g /= 2;
        return m;
      }, d = function(h, m, g) {
        for (var E = -1, C = g; ++E < 6; ) C += m * h[E], h[E] = C % 1e7, C = a(C / 1e7);
      }, b = function(h, m) {
        for (var g = 6, E = 0; --g >= 0; ) E += h[g], h[g] = a(E / m), E = E % m * 1e7;
      }, v = function(h) {
        for (var m = 6, g = ""; --m >= 0; ) if (g !== "" || m === 0 || h[m] !== 0) {
          var E = String(h[m]);
          g = g === "" ? E : g + t.call("0", 7 - E.length) + E;
        }
        return g;
      }, p = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !c(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: p }, { toFixed: function(h) {
        var m, g, E, C, w = o(this), O = r(h), y = [0, 0, 0, 0, 0, 0], j = "", S = "0";
        if (O < 0 || O > 20) throw RangeError("Incorrect fraction digits");
        if (w != w) return "NaN";
        if (w <= -1e21 || w >= 1e21) return String(w);
        if (w < 0 && (j = "-", w = -w), w > 1e-21) if (m = l(w * s(2, 69, 1)) - 69, g = m < 0 ? w * s(2, -m, 1) : w / s(2, m, 1), g *= 4503599627370496, m = 52 - m, m > 0) {
          for (d(y, 0, g), E = O; E >= 7; ) d(y, 1e7, 0), E -= 7;
          for (d(y, s(10, E, 1), 0), E = m - 1; E >= 23; ) b(y, 1 << 23), E -= 23;
          b(y, 1 << E), d(y, 1, 1), b(y, 2), S = v(y);
        } else d(y, 0, g), d(y, 1 << -m, 0), S = v(y) + t.call("0", O);
        return O > 0 ? (C = S.length, S = j + (C <= O ? "0." + t.call("0", O - C) + S : S.slice(0, C - O) + "." + S.slice(C - O))) : S = j + S, S;
      } });
    }, b727: function(i, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), c = e("65f0"), u = [].push, a = function(s) {
        var l = s == 1, d = s == 2, b = s == 3, v = s == 4, p = s == 6, h = s == 7, m = s == 5 || p;
        return function(g, E, C, w) {
          for (var O, y, j = o(g), S = r(j), A = n(E, C, 3), k = t(S.length), N = 0, _ = w || c, T = l ? _(g, k) : d || h ? _(g, 0) : void 0; k > N; N++) if ((m || N in S) && (O = S[N], y = A(O, N, j), s)) if (l) T[N] = y;
          else if (y) switch (s) {
            case 3:
              return !0;
            case 5:
              return O;
            case 6:
              return N;
            case 2:
              u.call(T, O);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              u.call(T, O);
          }
          return p ? -1 : b || v ? v : T;
        };
      };
      i.exports = { forEach: a(0), map: a(1), filter: a(2), some: a(3), every: a(4), find: a(5), findIndex: a(6), filterOut: a(7) };
    }, b8d6: function(i, f, e) {
    }, bb2f: function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(i, f, e) {
      i.exports = e("cee4");
    }, c04e: function(i, f, e) {
      var n = e("861d");
      i.exports = function(r, o) {
        if (!n(r)) return r;
        var t, c;
        if (o && typeof (t = r.toString) == "function" && !n(c = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(c = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(c = t.call(r))) return c;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, f, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(o) {
        var t, c, u, a = {};
        return o && n.forEach(o.split(`
`), function(s) {
          if (u = s.indexOf(":"), t = n.trim(s.substr(0, u)).toLowerCase(), c = n.trim(s.substr(u + 1)), t) {
            if (a[t] && r.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([c]) : a[t] ? a[t] + ", " + c : c;
          }
        }), a;
      };
    }, c401: function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o, t) {
        return n.forEach(t, function(c) {
          r = c(r, o);
        }), r;
      };
    }, c430: function(i, f) {
      i.exports = !1;
    }, c532: function(i, f, e) {
      var n = e("1d2b"), r = Object.prototype.toString;
      function o(k) {
        return r.call(k) === "[object Array]";
      }
      function t(k) {
        return typeof k > "u";
      }
      function c(k) {
        return k !== null && !t(k) && k.constructor !== null && !t(k.constructor) && typeof k.constructor.isBuffer == "function" && k.constructor.isBuffer(k);
      }
      function u(k) {
        return r.call(k) === "[object ArrayBuffer]";
      }
      function a(k) {
        return typeof FormData < "u" && k instanceof FormData;
      }
      function s(k) {
        var N;
        return N = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(k) : k && k.buffer && k.buffer instanceof ArrayBuffer, N;
      }
      function l(k) {
        return typeof k == "string";
      }
      function d(k) {
        return typeof k == "number";
      }
      function b(k) {
        return k !== null && typeof k == "object";
      }
      function v(k) {
        if (r.call(k) !== "[object Object]") return !1;
        var N = Object.getPrototypeOf(k);
        return N === null || N === Object.prototype;
      }
      function p(k) {
        return r.call(k) === "[object Date]";
      }
      function h(k) {
        return r.call(k) === "[object File]";
      }
      function m(k) {
        return r.call(k) === "[object Blob]";
      }
      function g(k) {
        return r.call(k) === "[object Function]";
      }
      function E(k) {
        return b(k) && g(k.pipe);
      }
      function C(k) {
        return typeof URLSearchParams < "u" && k instanceof URLSearchParams;
      }
      function w(k) {
        return k.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function O() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function y(k, N) {
        if (k !== null && typeof k < "u") if (typeof k != "object" && (k = [k]), o(k)) for (var _ = 0, T = k.length; _ < T; _++) N.call(null, k[_], _, k);
        else for (var Y in k) Object.prototype.hasOwnProperty.call(k, Y) && N.call(null, k[Y], Y, k);
      }
      function j() {
        var k = {};
        function N(Y, X) {
          v(k[X]) && v(Y) ? k[X] = j(k[X], Y) : v(Y) ? k[X] = j({}, Y) : o(Y) ? k[X] = Y.slice() : k[X] = Y;
        }
        for (var _ = 0, T = arguments.length; _ < T; _++) y(arguments[_], N);
        return k;
      }
      function S(k, N, _) {
        return y(N, function(T, Y) {
          k[Y] = _ && typeof T == "function" ? n(T, _) : T;
        }), k;
      }
      function A(k) {
        return k.charCodeAt(0) === 65279 && (k = k.slice(1)), k;
      }
      i.exports = { isArray: o, isArrayBuffer: u, isBuffer: c, isFormData: a, isArrayBufferView: s, isString: l, isNumber: d, isObject: b, isPlainObject: v, isUndefined: t, isDate: p, isFile: h, isBlob: m, isFunction: g, isStream: E, isURLSearchParams: C, isStandardBrowserEnv: O, forEach: y, merge: j, extend: S, trim: w, stripBOM: A };
    }, c6b6: function(i, f) {
      var e = {}.toString;
      i.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(i, f, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      i.exports = t;
    }, c8af: function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        n.forEach(r, function(t, c) {
          c !== o && c.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[c]);
        });
      };
    }, c8ba: function(i, f) {
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
    }, ca84: function(i, f, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      i.exports = function(c, u) {
        var a, s = r(c), l = 0, d = [];
        for (a in s) !n(t, a) && n(s, a) && d.push(a);
        for (; u.length > l; ) n(s, a = u[l++]) && (~o(d, a) || d.push(a));
        return d;
      };
    }, caad: function(i, f, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(i, f, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      i.exports = function(c) {
        return t ? o.createElement(c) : {};
      };
    }, cdf9: function(i, f, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      i.exports = function(t, c) {
        if (n(t), r(c) && c.constructor === t) return c;
        var u = o.f(t), a = u.resolve;
        return a(c), u.promise;
      };
    }, ce4e: function(i, f, e) {
      var n = e("da84"), r = e("9112");
      i.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(i, f, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), c = e("2444");
      function u(s) {
        var l = new o(s), d = r(o.prototype.request, l);
        return n.extend(d, o.prototype, l), n.extend(d, l), d;
      }
      var a = u(c);
      a.Axios = o, a.create = function(s) {
        return u(t(a.defaults, s));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(s) {
        return Promise.all(s);
      }, a.spread = e("0df6"), a.isAxiosError = e("5f02"), i.exports = a, i.exports.default = a;
    }, d012: function(i, f) {
      i.exports = {};
    }, d039: function(i, f) {
      i.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(i, f, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, c) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][c] || r[t] && r[t][c];
      };
    }, d1e7: function(i, f, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      f.f = o ? function(t) {
        var c = r(this, t);
        return !!c && c.enumerable;
      } : n;
    }, d28b: function(i, f, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, f, e) {
      var n = e("825a"), r = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, c = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(c, []), t = c instanceof Array;
        } catch {
        }
        return function(u, a) {
          return n(u), r(a), t ? o.call(u, a) : u.__proto__ = a, u;
        };
      }() : void 0);
    }, d3b7: function(i, f, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
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
      t.a.add(c), f.default = c;
    }, d44e: function(i, f, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      i.exports = function(c, u, a) {
        c && !r(c = a ? c : c.prototype, t) && n(c, t, { configurable: !0, value: u });
      };
    }, d58f: function(i, f, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), c = function(u) {
        return function(a, s, l, d) {
          n(s);
          var b = r(a), v = o(b), p = t(b.length), h = u ? p - 1 : 0, m = u ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in v) {
              d = v[h], h += m;
              break;
            }
            if (h += m, u ? h < 0 : p <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? h >= 0 : p > h; h += m) h in v && (d = s(d, v[h], h, b));
          return d;
        };
      };
      i.exports = { left: c(!1), right: c(!0) };
    }, d69c: function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), c = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(c), f.default = c;
    }, d784: function(i, f, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), c = e("9112"), u = o("species"), a = !r(function() {
        var v = /./;
        return v.exec = function() {
          var p = [];
          return p.groups = { a: "7" }, p;
        }, "".replace(v, "$<a>") !== "7";
      }), s = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = o("replace"), d = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), b = !r(function() {
        var v = /(?:)/, p = v.exec;
        v.exec = function() {
          return p.apply(this, arguments);
        };
        var h = "ab".split(v);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      i.exports = function(v, p, h, m) {
        var g = o(v), E = !r(function() {
          var S = {};
          return S[g] = function() {
            return 7;
          }, ""[v](S) != 7;
        }), C = E && !r(function() {
          var S = !1, A = /a/;
          return v === "split" && (A = {}, A.constructor = {}, A.constructor[u] = function() {
            return A;
          }, A.flags = "", A[g] = /./[g]), A.exec = function() {
            return S = !0, null;
          }, A[g](""), !S;
        });
        if (!E || !C || v === "replace" && (!a || !s || d) || v === "split" && !b) {
          var w = /./[g], O = h(g, ""[v], function(S, A, k, N, _) {
            return A.exec === t ? E && !_ ? { done: !0, value: w.call(A, k, N) } : { done: !0, value: S.call(k, A, N) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), y = O[0], j = O[1];
          n(String.prototype, v, y), n(RegExp.prototype, g, p == 2 ? function(S, A) {
            return j.call(S, this, A);
          } : function(S) {
            return j.call(S, this);
          });
        }
        m && c(RegExp.prototype[g], "sham", !0);
      };
    }, d81d: function(i, f, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(i, f, e) {
      i.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(i, f, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        i.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), c = e("06cf"), u = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(a) {
        for (var s, l, d = t(a), b = c.f, v = o(d), p = {}, h = 0; v.length > h; ) l = b(d, s = v[h++]), l !== void 0 && u(p, s, l);
        return p;
      } });
    }, ddb0: function(i, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), c = e("b622"), u = c("iterator"), a = c("toStringTag"), s = o.values;
      for (var l in r) {
        var d = n[l], b = d && d.prototype;
        if (b) {
          if (b[u] !== s) try {
            t(b, u, s);
          } catch {
            b[u] = s;
          }
          if (b[a] || t(b, a, l), r[l]) {
            for (var v in o) if (b[v] !== o[v]) try {
              t(b, v, o[v]);
            } catch {
              b[v] = o[v];
            }
          }
        }
      }
    }, de23: function(i, f, e) {
      e("7305");
    }, df75: function(i, f, e) {
      var n = e("ca84"), r = e("7839");
      i.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(i, f, e) {
      (function(n) {
        function r(u, a) {
          for (var s = 0, l = u.length - 1; l >= 0; l--) {
            var d = u[l];
            d === "." ? u.splice(l, 1) : d === ".." ? (u.splice(l, 1), s++) : s && (u.splice(l, 1), s--);
          }
          if (a) for (; s--; s) u.unshift("..");
          return u;
        }
        function o(u) {
          typeof u != "string" && (u += "");
          var a, s = 0, l = -1, d = !0;
          for (a = u.length - 1; a >= 0; --a) if (u.charCodeAt(a) === 47) {
            if (!d) {
              s = a + 1;
              break;
            }
          } else l === -1 && (d = !1, l = a + 1);
          return l === -1 ? "" : u.slice(s, l);
        }
        function t(u, a) {
          if (u.filter) return u.filter(a);
          for (var s = [], l = 0; l < u.length; l++) a(u[l], l, u) && s.push(u[l]);
          return s;
        }
        f.resolve = function() {
          for (var u = "", a = !1, s = arguments.length - 1; s >= -1 && !a; s--) {
            var l = s >= 0 ? arguments[s] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (u = l + "/" + u, a = l.charAt(0) === "/");
          }
          return u = r(t(u.split("/"), function(d) {
            return !!d;
          }), !a).join("/"), (a ? "/" : "") + u || ".";
        }, f.normalize = function(u) {
          var a = f.isAbsolute(u), s = c(u, -1) === "/";
          return u = r(t(u.split("/"), function(l) {
            return !!l;
          }), !a).join("/"), u || a || (u = "."), u && s && (u += "/"), (a ? "/" : "") + u;
        }, f.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, f.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return f.normalize(t(u, function(a, s) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, f.relative = function(u, a) {
          function s(m) {
            for (var g = 0; g < m.length && m[g] === ""; g++) ;
            for (var E = m.length - 1; E >= 0 && m[E] === ""; E--) ;
            return g > E ? [] : m.slice(g, E - g + 1);
          }
          u = f.resolve(u).substr(1), a = f.resolve(a).substr(1);
          for (var l = s(u.split("/")), d = s(a.split("/")), b = Math.min(l.length, d.length), v = b, p = 0; p < b; p++) if (l[p] !== d[p]) {
            v = p;
            break;
          }
          var h = [];
          for (p = v; p < l.length; p++) h.push("..");
          return h = h.concat(d.slice(v)), h.join("/");
        }, f.sep = "/", f.delimiter = ":", f.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var a = u.charCodeAt(0), s = a === 47, l = -1, d = !0, b = u.length - 1; b >= 1; --b) if (a = u.charCodeAt(b), a === 47) {
            if (!d) {
              l = b;
              break;
            }
          } else d = !1;
          return l === -1 ? s ? "/" : "." : s && l === 1 ? "/" : u.slice(0, l);
        }, f.basename = function(u, a) {
          var s = o(u);
          return a && s.substr(-1 * a.length) === a && (s = s.substr(0, s.length - a.length)), s;
        }, f.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var a = -1, s = 0, l = -1, d = !0, b = 0, v = u.length - 1; v >= 0; --v) {
            var p = u.charCodeAt(v);
            if (p !== 47) l === -1 && (d = !1, l = v + 1), p === 46 ? a === -1 ? a = v : b !== 1 && (b = 1) : a !== -1 && (b = -1);
            else if (!d) {
              s = v + 1;
              break;
            }
          }
          return a === -1 || l === -1 || b === 0 || b === 1 && a === l - 1 && a === s + 1 ? "" : u.slice(a, l);
        };
        var c = "ab".substr(-1) === "b" ? function(u, a, s) {
          return u.substr(a, s);
        } : function(u, a, s) {
          return a < 0 && (a = u.length + a), u.substr(a, s);
        };
      }).call(this, e("4362"));
    }, e017: function(i, f, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          var r = function(p) {
            var h = p.id, m = p.viewBox, g = p.content;
            this.id = h, this.viewBox = m, this.content = g;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var p = this;
            ["id", "viewBox", "content"].forEach(function(h) {
              return delete p[h];
            });
          };
          var o = function(p) {
            var h = !!document.importNode, m = new DOMParser().parseFromString(p, "image/svg+xml").documentElement;
            return h ? document.importNode(m, !0) : m;
          };
          function t(p, h) {
            return h = { exports: {} }, p(h, h.exports), h.exports;
          }
          var c = t(function(p, h) {
            (function(m, g) {
              p.exports = g();
            })(0, function() {
              function m(y) {
                var j = y && typeof y == "object";
                return j && Object.prototype.toString.call(y) !== "[object RegExp]" && Object.prototype.toString.call(y) !== "[object Date]";
              }
              function g(y) {
                return Array.isArray(y) ? [] : {};
              }
              function E(y, j) {
                var S = j && j.clone === !0;
                return S && m(y) ? O(g(y), y, j) : y;
              }
              function C(y, j, S) {
                var A = y.slice();
                return j.forEach(function(k, N) {
                  typeof A[N] > "u" ? A[N] = E(k, S) : m(k) ? A[N] = O(y[N], k, S) : y.indexOf(k) === -1 && A.push(E(k, S));
                }), A;
              }
              function w(y, j, S) {
                var A = {};
                return m(y) && Object.keys(y).forEach(function(k) {
                  A[k] = E(y[k], S);
                }), Object.keys(j).forEach(function(k) {
                  m(j[k]) && y[k] ? A[k] = O(y[k], j[k], S) : A[k] = E(j[k], S);
                }), A;
              }
              function O(y, j, S) {
                var A = Array.isArray(j), k = S || { arrayMerge: C }, N = k.arrayMerge || C;
                return A ? Array.isArray(y) ? N(y, j, S) : E(j, S) : w(y, j, S);
              }
              return O.all = function(y, j) {
                if (!Array.isArray(y) || y.length < 2) throw new Error("first argument should be an array with at least two elements");
                return y.reduce(function(S, A) {
                  return O(S, A, j);
                });
              }, O;
            });
          }), u = t(function(p, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, p.exports = h.default;
          }), a = function(p) {
            return Object.keys(p).map(function(h) {
              var m = p[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, s = u.svg, l = u.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var b = function(p, h) {
            p === void 0 && (p = "");
            var m = c(d, {}), g = a(m);
            return "<svg " + g + ">" + p + "</svg>";
          }, v = function(p) {
            function h() {
              p.apply(this, arguments);
            }
            p && (h.__proto__ = p), h.prototype = Object.create(p && p.prototype), h.prototype.constructor = h;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(g) {
              return new h({ id: g.getAttribute("id"), viewBox: g.getAttribute("viewBox"), content: g.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), p.prototype.destroy.call(this);
            }, h.prototype.mount = function(g) {
              if (this.isMounted) return this.node;
              var E = typeof g == "string" ? document.querySelector(g) : g, C = this.render();
              return this.node = C, E.appendChild(C), C;
            }, h.prototype.render = function() {
              var g = this.stringify();
              return o(b(g)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(r);
          return v;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), c = e("861d"), u = e("9bf2").f, a = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), g = this instanceof d ? new s(m) : m === void 0 ? s() : s(m);
          return m === "" && (l[g] = !0), g;
        };
        a(d, s);
        var b = d.prototype = s.prototype;
        b.constructor = d;
        var v = b.toString, p = String(s("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        u(b, "description", { configurable: !0, get: function() {
          var m = c(this) ? this.valueOf() : this, g = v.call(m);
          if (t(l, m)) return "";
          var E = p ? g.slice(7, -1) : g.replace(h, "$1");
          return E === "" ? void 0 : E;
        } }), n({ global: !0, forced: !0 }, { Symbol: d });
      }
    }, e163: function(i, f, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), c = o("IE_PROTO"), u = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(a) {
        return a = r(a), n(a, c) ? a[c] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? u : null;
      };
    }, e177: function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(i, f, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), c = e("7dd0"), u = "Array Iterator", a = t.set, s = t.getterFor(u);
      i.exports = c(Array, "Array", function(l, d) {
        a(this, { type: u, target: n(l), index: 0, kind: d });
      }, function() {
        var l = s(this), d = l.target, b = l.kind, v = l.index++;
        return !d || v >= d.length ? (l.target = void 0, { value: void 0, done: !0 }) : b == "keys" ? { value: v, done: !1 } : b == "values" ? { value: d[v], done: !1 } : { value: [v, d[v]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(i, f, e) {
      var n = e("6eeb");
      i.exports = function(r, o, t) {
        for (var c in o) n(r, c, o[c], t);
        return r;
      };
    }, e439: function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, c = e("83ab"), u = r(function() {
        t(1);
      }), a = !c || u;
      n({ target: "Object", stat: !0, forced: a, sham: !c }, { getOwnPropertyDescriptor: function(s, l) {
        return t(o(s), l);
      } });
    }, e538: function(i, f, e) {
      var n = e("b622");
      f.f = n;
    }, e667: function(i, f) {
      i.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(i, f, e) {
      e("95d9");
    }, e683: function(i, f, e) {
      i.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(i, f, e) {
      var n, r, o, t, c = e("23e7"), u = e("c430"), a = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), b = e("e2cc"), v = e("d44e"), p = e("2626"), h = e("861d"), m = e("1c0b"), g = e("19aa"), E = e("8925"), C = e("2266"), w = e("1c7e"), O = e("4840"), y = e("2cf4").set, j = e("b575"), S = e("cdf9"), A = e("44de"), k = e("f069"), N = e("e667"), _ = e("69f3"), T = e("94ca"), Y = e("b622"), X = e("605d"), ce = e("2d00"), Z = Y("species"), L = "Promise", P = _.get, W = _.set, H = _.getterFor(L), D = l, be = a.TypeError, pe = a.document, Ne = a.process, Pe = s("fetch"), Re = k.f, Ee = Re, Ce = !!(pe && pe.createEvent && a.dispatchEvent), Ke = typeof PromiseRejectionEvent == "function", tt = "unhandledrejection", I = "rejectionhandled", $ = 0, K = 1, F = 2, Q = 1, ee = 2, me = T(L, function() {
        var q = E(D) !== String(D);
        if (!q && (ce === 66 || !X && !Ke) || u && !D.prototype.finally) return !0;
        if (ce >= 51 && /native code/.test(D)) return !1;
        var J = D.resolve(1), ue = function(V) {
          V(function() {
          }, function() {
          });
        }, fe = J.constructor = {};
        return fe[Z] = ue, !(J.then(function() {
        }) instanceof ue);
      }), he = me || !w(function(q) {
        D.all(q).catch(function() {
        });
      }), ie = function(q) {
        var J;
        return !(!h(q) || typeof (J = q.then) != "function") && J;
      }, we = function(q, J) {
        if (!q.notified) {
          q.notified = !0;
          var ue = q.reactions;
          j(function() {
            for (var fe = q.value, V = q.state == K, G = 0; ue.length > G; ) {
              var oe, de, Ie, qe = ue[G++], Je = V ? qe.ok : qe.fail, ye = qe.resolve, Ze = qe.reject, Qe = qe.domain;
              try {
                Je ? (V || (q.rejection === ee && Ve(q), q.rejection = Q), Je === !0 ? oe = fe : (Qe && Qe.enter(), oe = Je(fe), Qe && (Qe.exit(), Ie = !0)), oe === qe.promise ? Ze(be("Promise-chain cycle")) : (de = ie(oe)) ? de.call(oe, ye, Ze) : ye(oe)) : Ze(fe);
              } catch (ht) {
                Qe && !Ie && Qe.exit(), Ze(ht);
              }
            }
            q.reactions = [], q.notified = !1, J && !q.rejection && Be(q);
          });
        }
      }, ke = function(q, J, ue) {
        var fe, V;
        Ce ? (fe = pe.createEvent("Event"), fe.promise = J, fe.reason = ue, fe.initEvent(q, !1, !0), a.dispatchEvent(fe)) : fe = { promise: J, reason: ue }, !Ke && (V = a["on" + q]) ? V(fe) : q === tt && A("Unhandled promise rejection", ue);
      }, Be = function(q) {
        y.call(a, function() {
          var J, ue = q.facade, fe = q.value, V = Se(q);
          if (V && (J = N(function() {
            X ? Ne.emit("unhandledRejection", fe, ue) : ke(tt, ue, fe);
          }), q.rejection = X || Se(q) ? ee : Q, J.error)) throw J.value;
        });
      }, Se = function(q) {
        return q.rejection !== Q && !q.parent;
      }, Ve = function(q) {
        y.call(a, function() {
          var J = q.facade;
          X ? Ne.emit("rejectionHandled", J) : ke(I, J, q.value);
        });
      }, Ge = function(q, J, ue) {
        return function(fe) {
          q(J, fe, ue);
        };
      }, Xe = function(q, J, ue) {
        q.done || (q.done = !0, ue && (q = ue), q.value = J, q.state = F, we(q, !0));
      }, nt = function(q, J, ue) {
        if (!q.done) {
          q.done = !0, ue && (q = ue);
          try {
            if (q.facade === J) throw be("Promise can't be resolved itself");
            var fe = ie(J);
            fe ? j(function() {
              var V = { done: !1 };
              try {
                fe.call(J, Ge(nt, V, q), Ge(Xe, V, q));
              } catch (G) {
                Xe(V, G, q);
              }
            }) : (q.value = J, q.state = K, we(q, !1));
          } catch (V) {
            Xe({ done: !1 }, V, q);
          }
        }
      };
      me && (D = function(q) {
        g(this, D, L), m(q), n.call(this);
        var J = P(this);
        try {
          q(Ge(nt, J), Ge(Xe, J));
        } catch (ue) {
          Xe(J, ue);
        }
      }, n = function(q) {
        W(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: $, value: void 0 });
      }, n.prototype = b(D.prototype, { then: function(q, J) {
        var ue = H(this), fe = Re(O(this, D));
        return fe.ok = typeof q != "function" || q, fe.fail = typeof J == "function" && J, fe.domain = X ? Ne.domain : void 0, ue.parent = !0, ue.reactions.push(fe), ue.state != $ && we(ue, !1), fe.promise;
      }, catch: function(q) {
        return this.then(void 0, q);
      } }), r = function() {
        var q = new n(), J = P(q);
        this.promise = q, this.resolve = Ge(nt, J), this.reject = Ge(Xe, J);
      }, k.f = Re = function(q) {
        return q === D || q === o ? new r(q) : Ee(q);
      }, u || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(q, J) {
        var ue = this;
        return new D(function(fe, V) {
          t.call(ue, fe, V);
        }).then(q, J);
      }, { unsafe: !0 }), typeof Pe == "function" && c({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(q) {
        return S(D, Pe.apply(a, arguments));
      } }))), c({ global: !0, wrap: !0, forced: me }, { Promise: D }), v(D, L, !1, !0), p(L), o = s(L), c({ target: L, stat: !0, forced: me }, { reject: function(q) {
        var J = Re(this);
        return J.reject.call(void 0, q), J.promise;
      } }), c({ target: L, stat: !0, forced: u || me }, { resolve: function(q) {
        return S(u && this === o ? D : this, q);
      } }), c({ target: L, stat: !0, forced: he }, { all: function(q) {
        var J = this, ue = Re(J), fe = ue.resolve, V = ue.reject, G = N(function() {
          var oe = m(J.resolve), de = [], Ie = 0, qe = 1;
          C(q, function(Je) {
            var ye = Ie++, Ze = !1;
            de.push(void 0), qe++, oe.call(J, Je).then(function(Qe) {
              Ze || (Ze = !0, de[ye] = Qe, --qe || fe(de));
            }, V);
          }), --qe || fe(de);
        });
        return G.error && V(G.value), ue.promise;
      }, race: function(q) {
        var J = this, ue = Re(J), fe = ue.reject, V = N(function() {
          var G = m(J.resolve);
          C(q, function(oe) {
            G.call(J, oe).then(ue.resolve, fe);
          });
        });
        return V.error && fe(V.value), ue.promise;
      } });
    }, e893: function(i, f, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      i.exports = function(c, u) {
        for (var a = r(u), s = t.f, l = o.f, d = 0; d < a.length; d++) {
          var b = a[d];
          n(c, b) || s(c, b, l(u, b));
        }
      };
    }, e8b5: function(i, f, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(i, f, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      i.exports = function(c) {
        return c !== void 0 && (r.Array === c || t[o] === c);
      };
    }, ec57: function(i, f, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function r(t) {
        var c = o(t);
        return e(c);
      }
      function o(t) {
        if (!e.o(n, t)) {
          var c = new Error("Cannot find module '" + t + "'");
          throw c.code = "MODULE_NOT_FOUND", c;
        }
        return n[t];
      }
      r.keys = function() {
        return Object.keys(n);
      }, r.resolve = o, i.exports = r, r.id = "ec57";
    }, f069: function(i, f, e) {
      var n = e("1c0b"), r = function(o) {
        var t, c;
        this.promise = new o(function(u, a) {
          if (t !== void 0 || c !== void 0) throw TypeError("Bad Promise constructor");
          t = u, c = a;
        }), this.resolve = n(t), this.reject = n(c);
      };
      i.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(i, f, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, c = e("90e3"), u = e("bb2f"), a = c("meta"), s = 0, l = Object.isExtensible || function() {
        return !0;
      }, d = function(m) {
        t(m, a, { value: { objectID: "O" + ++s, weakData: {} } });
      }, b = function(m, g) {
        if (!r(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!o(m, a)) {
          if (!l(m)) return "F";
          if (!g) return "E";
          d(m);
        }
        return m[a].objectID;
      }, v = function(m, g) {
        if (!o(m, a)) {
          if (!l(m)) return !0;
          if (!g) return !1;
          d(m);
        }
        return m[a].weakData;
      }, p = function(m) {
        return u && h.REQUIRED && l(m) && !o(m, a) && d(m), m;
      }, h = i.exports = { REQUIRED: !1, fastKey: b, getWeakData: v, onFreeze: p };
      n[a] = !0;
    }, f5df: function(i, f, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), c = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(a, s) {
        try {
          return a[s];
        } catch {
        }
      };
      i.exports = n ? r : function(a) {
        var s, l, d;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (l = u(s = Object(a), t)) == "string" ? l : c ? r(s) : (d = r(s)) == "Object" && typeof s.callee == "function" ? "Arguments" : d;
      };
    }, f6b4: function(i, f, e) {
      var n = e("c532");
      function r() {
        this.handlers = [];
      }
      r.prototype.use = function(o, t) {
        return this.handlers.push({ fulfilled: o, rejected: t }), this.handlers.length - 1;
      }, r.prototype.eject = function(o) {
        this.handlers[o] && (this.handlers[o] = null);
      }, r.prototype.forEach = function(o) {
        n.forEach(this.handlers, function(t) {
          t !== null && o(t);
        });
      }, i.exports = r;
    }, f772: function(i, f, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      i.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(i, f, e) {
      e("b8d6");
    }, fb15: function(i, f, e) {
      if (e.r(f), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), c = { class: "key-board-container" }, u = { class: "key-board-area" };
      function a(x, U, R, B, z, re) {
        var le = Object(t.resolveComponent)("Result"), ae = Object(t.resolveComponent)("DefaultBoard"), ve = Object(t.resolveComponent)("HandBoard"), Me = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: U[1] || (U[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", c, [Object(t.createVNode)(le, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ae, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ve, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Me, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, U, R) {
        return U in x ? Object.defineProperty(x, U, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : x[U] = R, x;
      }
      function l(x, U) {
        var R = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var B = Object.getOwnPropertySymbols(x);
          U && (B = B.filter(function(z) {
            return Object.getOwnPropertyDescriptor(x, z).enumerable;
          })), R.push.apply(R, B);
        }
        return R;
      }
      function d(x) {
        for (var U = 1; U < arguments.length; U++) {
          var R = arguments[U] != null ? arguments[U] : {};
          U % 2 ? l(Object(R), !0).forEach(function(B) {
            s(x, B, R[B]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(R)) : l(Object(R)).forEach(function(B) {
            Object.defineProperty(x, B, Object.getOwnPropertyDescriptor(R, B));
          });
        }
        return x;
      }
      function b(x, U) {
        (U == null || U > x.length) && (U = x.length);
        for (var R = 0, B = new Array(U); R < U; R++) B[R] = x[R];
        return B;
      }
      function v(x) {
        if (Array.isArray(x)) return b(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function p(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, U) {
        if (x) {
          if (typeof x == "string") return b(x, U);
          var R = Object.prototype.toString.call(x).slice(8, -1);
          return R === "Object" && x.constructor && (R = x.constructor.name), R === "Map" || R === "Set" ? Array.from(x) : R === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(R) ? b(x, U) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function g(x) {
        return v(x) || p(x) || h(x) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function E(x, U) {
        if (!(x instanceof U)) throw new TypeError("Cannot call a class as a function");
      }
      function C(x, U) {
        for (var R = 0; R < U.length; R++) {
          var B = U[R];
          B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(x, B.key, B);
        }
      }
      function w(x, U, R) {
        return U && C(x.prototype, U), x;
      }
      var O = function() {
        function x() {
          E(this, x), this.listeners = {};
        }
        return w(x, [{ key: "on", value: function(U, R) {
          var B = this, z = this.listeners[U];
          return z || (z = []), z.push(R), this.listeners[U] = z, function() {
            B.remove(U, R);
          };
        } }, { key: "emit", value: function(U) {
          var R = this.listeners[U];
          if (Array.isArray(R)) {
            for (var B = arguments.length, z = new Array(B > 1 ? B - 1 : 0), re = 1; re < B; re++) z[re - 1] = arguments[re];
            for (var le = 0; le < R.length; le++) {
              var ae = R[le];
              typeof ae == "function" && ae.apply(void 0, z);
            }
          }
        } }, { key: "remove", value: function(U, R) {
          if (R) {
            var B = this.listeners[U];
            if (!B) return;
            B = B.filter(function(z) {
              return z !== R;
            }), this.listeners[U] = B;
          } else this.listeners[U] = null, delete this.listeners[U];
        } }]), x;
      }(), y = new O(), j = { mounted: function(x, U, R) {
        var B = x.parentNode;
        x.onmousedown = function(z) {
          var re = z.clientX - B.offsetLeft, le = z.clientY - B.offsetTop;
          document.onmousemove = function(ae) {
            var ve = ae.clientX - re, Me = ae.clientY - le;
            B.style.left = ve + "px", B.style.top = Me + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(z) {
          var re = z.touches[0].pageX, le = z.touches[0].pageY, ae = re - B.offsetLeft, ve = le - B.offsetTop;
          document.ontouchmove = function(Me) {
            var Ue = Me.touches[0].pageX, Fe = Me.touches[0].pageY, ze = Ue - ae, lt = Fe - ve;
            B.style.left = ze + "px", B.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, S = j, A = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var k = { key: 0, class: "key-board-code-show" }, N = { class: "key-board-result-show" }, _ = { class: "key-board-result-show-container" }, T = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var Y = A(function(x, U, R, B, z, re) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", k, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", N, [Object(t.createVNode)("div", _, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(le, ae) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ae, onClick: function(ve) {
            return x.selectWord(le);
          } }, Object(t.toDisplayString)(ae + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", T, [Object(t.createVNode)("span", { style: x.getStyle, onClick: U[1] || (U[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: U[2] || (U[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), X = (e("1276"), e("6062"), e("5319"), function(x, U) {
        for (var R = 0, B = []; R < x.length; ) B.push(x.slice(R, R += U));
        return B;
      }), ce = Symbol("KEYBOARD_CONTEXT"), Z = function(x) {
        Object(t.provide)(ce, x);
      }, L = function() {
        return Object(t.inject)(ce);
      }, P = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, U) {
        var R = U.emit, B = L(), z = Object(t.computed)(function() {
          return { borderTopColor: B == null ? void 0 : B.color };
        }), re = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          re.showIndex !== 0 && (re.showIndex -= 1);
        }
        function ae() {
          re.showIndex !== re.showList.length - 1 && (re.showIndex += 1);
        }
        function ve() {
          re.showIndex = 0, re.showList = [], re.valueList = [], y.emit("resultReset");
        }
        function Me(Ue) {
          ve(), R("change", Ue);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Ue) {
          var Fe;
          re.showIndex = 0, re.valueList = (Ue == null || (Fe = Ue.value) === null || Fe === void 0 ? void 0 : Fe.split("")) || [], re.valueList.length !== 0 ? re.showList = X(re.valueList, 11) : re.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          y.on("keyBoardChange", function(Ue) {
            y.emit("updateBound"), re.status = Ue, ve();
          }), y.on("getWordsFromServer", function(Ue) {
            var Fe = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            re.valueList = Fe, re.showList = X(Fe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          y.remove("keyBoardChange"), y.remove("getWordsFromServer");
        }), d({ color: B == null ? void 0 : B.color, upper: le, lower: ae, getStyle: z, selectWord: Me }, Object(t.toRefs)(re));
      } });
      e("e66c"), P.render = Y, P.__scopeId = "data-v-02e63132";
      var W = P, H = e("bc3a"), D = e.n(H), be = 15e3, pe = function(x) {
        D.a.defaults.baseURL = x, D.a.defaults.timeout = be, D.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ne(x, U, R, B, z, re) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Pe = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var U = L(), R = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: U == null ? void 0 : U.color, iconName: R };
      } });
      e("38cd"), Pe.render = Ne;
      var Re = Pe, Ee = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ce = { class: "hand-write-board" }, Ke = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var tt = Ee(function(x, U, R, B, z, re) {
        var le = Object(t.resolveComponent)("PaintBoard"), ae = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ce, [Object(t.createVNode)(le, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ke, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ve) {
          return Object(t.openBlock)(), Object(t.createBlock)(ae, { key: ve.type, type: ve.type, data: ve.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), I = { class: "paint-board" };
      function $(x, U, R, B, z, re) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", I, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: U[1] || (U[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: U[2] || (U[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: U[3] || (U[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: U[4] || (U[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: U[5] || (U[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: U[6] || (U[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: U[7] || (U[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function K(x, U, R, B, z, re, le) {
        try {
          var ae = x[re](le), ve = ae.value;
        } catch (Me) {
          return void R(Me);
        }
        ae.done ? U(ve) : Promise.resolve(ve).then(B, z);
      }
      function F(x) {
        return function() {
          var U = this, R = arguments;
          return new Promise(function(B, z) {
            var re = x.apply(U, R);
            function le(ve) {
              K(re, B, z, le, ae, "next", ve);
            }
            function ae(ve) {
              K(re, B, z, le, ae, "throw", ve);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var Q, ee, me = function() {
        var x = F(regeneratorRuntime.mark(function U(R, B, z, re) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, D.a.post("", { lib: re, lpXis: R, lpYis: B, lpCis: z });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, U);
        }));
        return function(U, R, B, z) {
          return x.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var U = L(), R = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), B = Object(t.ref)(null);
        function z() {
          return re.apply(this, arguments);
        }
        function re() {
          return re = F(regeneratorRuntime.mark(function je() {
            var We, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, me(R.clickX, R.clickY, R.clickC, x.lib);
                case 2:
                  We = Ye.sent, $e = We.data, y.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, je);
          })), re.apply(this, arguments);
        }
        function le() {
          B.value && Q && (R.clickX = [], R.clickY = [], R.clickC = [], Q.clearRect(0, 0, R.width, R.height));
        }
        function ae(je) {
          if (je.type.includes("mouse")) {
            var We = je;
            return Math.floor(We.clientX - R.x);
          }
          if (je.type.includes("touch")) {
            var $e, Ye = je;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - R.x);
          }
          return 0;
        }
        function ve(je) {
          if (je.type.includes("mouse")) {
            var We = je;
            return Math.floor(We.clientY - R.y);
          }
          if (je.type.includes("touch")) {
            var $e, Ye = je;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - R.y);
          }
          return 0;
        }
        function Me(je) {
          if (Q) {
            R.isMouseDown = !0;
            var We = ae(je), $e = ve(je);
            clearTimeout(ee), R.oldX = We, R.oldY = $e, Q.beginPath();
          }
        }
        function Ue(je) {
          if (Q && (je.preventDefault(), R.isMouseDown)) {
            var We = ae(je), $e = ve(je);
            R.clickX.push(We), R.clickY.push($e), R.clickC.push(0), Q.strokeStyle = U == null ? void 0 : U.color, Q.fillStyle = U == null ? void 0 : U.color, Q.lineWidth = 4, Q.lineCap = "round", Q.moveTo(R.oldX, R.oldY), Q.lineTo(We, $e), Q.stroke(), R.oldX = We, R.oldY = $e;
          }
        }
        function Fe() {
          R.isMouseDown && (R.isMouseDown = !1, ee = setTimeout(function() {
            le();
          }, 1500), R.clickC.pop(), R.clickC.push(1), z());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var je = document.querySelector(".paint-board").getBoundingClientRect();
              R.x = je.x, R.y = je.y, R.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), R.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function lt() {
          var je;
          Q = (je = B.value) === null || je === void 0 ? void 0 : je.getContext("2d"), le(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          lt(), y.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), y.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(R)), {}, { move: Ue, down: Me, mouseup: Fe, canvasRef: B });
      } });
      he.render = $;
      var ie = he;
      function we(x, U, R, B, z, re) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: U[1] || (U[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: U[2] || (U[2] = function(ae) {
          return x.isHoverStatus = !0;
        }), onMouseleave: U[3] || (U[3] = function(ae) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ke = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Re }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, U) {
        var R = U.emit, B = L(), z = Object(t.ref)(!1), re = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), le = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || z.value ? { color: "#f5f5f5", background: B == null ? void 0 : B.color } : { color: B == null ? void 0 : B.color, background: "#f5f5f5" };
        });
        function ae(ve) {
          ve.preventDefault(), R("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: z, getStyle: le, getCode: re, click: ae };
      } });
      e("de23"), ke.render = we;
      var Be = ke, Se = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ie, KeyCodeButton: Be }, setup: function(x, U) {
        var R = U.emit, B = L(), z = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function re(le) {
          var ae = le.data, ve = le.type;
          switch (ve) {
            case "close":
              B == null || B.closeKeyBoard();
              break;
            case "back":
              B == null || B.changeDefaultBoard(), y.emit("resultReset"), y.emit("keyBoardChange", z.isCn && "CN");
              break;
            case "change2lang":
              z.isCn = !z.isCn;
              break;
            case "delete":
              R("trigger", { data: ae, type: ve });
              break;
          }
        }
        return d({ click: re }, Object(t.toRefs)(z));
      } });
      e("9aaf"), Se.render = tt, Se.__scopeId = "data-v-1b5e0983";
      var Ve = Se, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var q = Ge(function(x, U, R, B, z, re) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(ae, ve) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ve + 1)], key: ve }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ae, function(Me) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: x.isUpper, key: Me, type: Me, data: Me, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(ae) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ae.type, type: ae.type, data: ae.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), J = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), ue = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, fe = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, V = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], G = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Be }, emits: ["translate", "trigger", "change"], setup: function(x, U) {
        var R = U.emit, B = L(), z = Object(t.reactive)({ lineList: [ue.line1, ue.line2, ue.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function re() {
          var ae;
          z.line4 = JSON.parse(JSON.stringify(V)), B != null && (ae = B.modeList) !== null && ae !== void 0 && ae.find(function(ve) {
            return ve === "handwrite";
          }) && B !== null && B !== void 0 && B.handApi && z.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ae) {
          var ve = ae.data, Me = ae.type;
          switch (Me) {
            case "close":
              z.oldVal = "", B == null || B.closeKeyBoard();
              break;
            case "upper":
              z.oldVal = "", z.isUpper = !z.isUpper;
              break;
            case "change2lang":
              z.isCn = !z.isCn, z.isNum || z.isSymbol || y.emit("keyBoardChange", z.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (z.isNum = !z.isNum, z.isSymbol = !1, z.isNum) {
                var Ue;
                y.emit("keyBoardChange", "number");
                var Fe = JSON.parse(JSON.stringify(fe.line3));
                B != null && (Ue = B.modeList) !== null && Ue !== void 0 && Ue.find(function(ze) {
                  return ze === "symbol";
                }) || (Fe.shift(), Fe.unshift("+")), z.lineList = [fe.line1, fe.line2, Fe];
              } else y.emit("keyBoardChange", z.isCn ? "CN" : "EN"), z.lineList = [ue.line1, ue.line2, ue.line3];
              break;
            case "#+=":
              z.isSymbol = !z.isSymbol, z.isSymbol ? (y.emit("keyBoardChange", "symbol"), z.lineList = [J.line1, J.line2, J.line3]) : (y.emit("keyBoardChange", "number"), z.lineList = [fe.line1, fe.line2, fe.line3]);
              break;
            case "handwrite":
            case "delete":
              z.isCn && Me === "delete" && z.oldVal ? (z.oldVal = z.oldVal.substr(0, z.oldVal.length - 1), R("translate", z.oldVal)) : (Me === "handwrite" && y.emit("keyBoardChange", "handwrite"), R("trigger", { data: ve, type: Me }));
              break;
            default:
              !z.isCn || z.isNum || z.isSymbol ? R("change", ve) : (R("translate", z.oldVal + ve), z.oldVal = z.oldVal + ve);
              break;
          }
        }
        return re(), Object(t.onMounted)(function() {
          y.on("resultReset", function() {
            z.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(z)), {}, { click: le });
      } });
      e("f8b0"), G.render = q, G.__scopeId = "data-v-4b78e5a1";
      var oe = G, de = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ie = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Ie);
      var Je = [], ye = null, Ze = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: S }, components: { Result: W, SvgIcon: Re, HandBoard: Ve, DefaultBoard: oe }, setup: function(x, U) {
        var R = U.emit, B = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), z = Object(t.ref)(null);
        function re(xe) {
          var Oe, _e;
          switch (Object(t.nextTick)(function() {
            y.emit("keyBoardChange", "CN");
          }), xe) {
            case "en":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Te;
                (Te = z.value) === null || Te === void 0 || Te.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Te;
                (Te = z.value) === null || Te === void 0 || Te.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Oe = x.modeList) !== null && Oe !== void 0 && Oe.find(function(Te) {
                return Te === "handwrite";
              }) && x.handApi ? (B.showMode = "handwrite", Object(t.nextTick)(function() {
                y.emit("keyBoardChange", "handwrite");
              })) : B.showMode = "default";
              break;
            case "symbol":
              B.showMode = "default", (_e = x.modeList) !== null && _e !== void 0 && _e.find(function(Te) {
                return Te === "symbol";
              }) && Object(t.nextTick)(function() {
                var Te, et;
                (Te = z.value) === null || Te === void 0 || Te.click({ data: ".?123", type: "change2num" }), (et = z.value) === null || et === void 0 || et.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              B.showMode = "default";
              break;
          }
        }
        function le(xe) {
          if (B.visible = !0, ye = xe.target, re(ye.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Oe = document.querySelector(".key-board-modal");
            Oe.style.display = "block";
          }
        }
        function ae() {
          if (ye && ye.blur(), ye = null, B.visible = !1, R("closed"), B.showMode = "default", B.resultVal = {}, document.querySelector(".key-board-modal")) {
            var xe = document.querySelector(".key-board-modal");
            xe.style.display = "none";
          }
        }
        function ve() {
          x.closeOnClickModal && ae(), R("modalClick");
        }
        function Me() {
          var xe;
          if (document.querySelector(".key-board-modal")) {
            var Oe;
            (Oe = document.querySelector(".key-board-modal")) === null || Oe === void 0 || Oe.addEventListener("click", ve);
          } else {
            var _e = document.createElement("div");
            _e.className = "key-board-modal", _e.style.display = "none", (xe = document.querySelector("body")) === null || xe === void 0 || xe.appendChild(_e), _e.addEventListener("click", ve);
          }
        }
        function Ue() {
          x.handApi && pe(x.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(xe) {
            xe.getAttribute("data-mode") !== null && (Je.push(xe), xe.addEventListener("focus", le), x.blurHide && xe.addEventListener("blur", ae));
          });
        }
        function Fe(xe) {
          if (!ye) return "";
          var Oe = ye, _e = Oe.selectionStart, Te = Oe.selectionEnd;
          if (!_e || !Te) return "";
          var et = xe.substring(0, _e - 1) + xe.substring(Te);
          return Oe.value = et, Oe.focus(), Oe.selectionStart = _e - 1, Oe.selectionEnd = _e - 1, et;
        }
        function ze(xe) {
          var Oe = xe.type;
          switch (Oe) {
            case "handwrite":
              B.showMode = "handwrite";
              break;
            case "delete":
              if (!ye) return;
              var _e = Fe(ye.value);
              ye.value = _e, R("change", _e, ye.getAttribute("data-prop") || ye);
              break;
          }
        }
        function lt(xe, Oe) {
          if (!ye) return "";
          var _e = ye, Te = _e.selectionStart || 0, et = _e.selectionEnd || 0, kt = xe.substring(0, Te) + Oe + xe.substring(et);
          return _e.value = kt, _e.focus(), _e.selectionStart = Te + Oe.length, _e.selectionEnd = Te + Oe.length, kt;
        }
        function je(xe) {
          if (ye) {
            var Oe = lt(ye.value, xe);
            ye.value = Oe, R("change", Oe, ye.getAttribute("data-prop") || ye), R("keyChange", xe, ye.getAttribute("data-prop") || ye);
          }
        }
        function We(xe) {
          var Oe = new RegExp("^".concat(xe, "\\w*")), _e = Object.keys(de).filter(function(Te) {
            return Oe.test(Te);
          }).sort();
          B.resultVal = { code: xe, value: xe ? _e.length > 1 ? _e.reduce(function(Te, et) {
            return Te + de[et];
          }, "") : de[_e[0]] : "" }, ye && R("keyChange", xe, ye.getAttribute("data-prop") || ye);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return ye;
        }
        return Object(t.onMounted)(function() {
          x.modal && Me(), Ue(), y.on("resultReset", function() {
            B.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var xe;
          (xe = document.querySelector(".key-board-modal")) === null || xe === void 0 || xe.removeEventListener("click", ve), Je.forEach(function(Oe) {
            Oe.removeEventListener("focus", le), Oe.removeEventListener("blur", ae);
          });
        }), Z(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          ae();
        }, changeDefaultBoard: function() {
          B.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(B)), {}, { defaultBoardRef: z, getCurrentInput: Ye, translate: We, reSignUp: $e, trigger: ze, change: je });
      } });
      Ze.render = a;
      var Qe = Ze;
      Qe.install = function(x) {
        x.component(Qe.name, Qe);
      };
      var ht = Qe, At = ht;
      f.default = At;
    }, fb6a: function(i, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), c = e("50c4"), u = e("fc6a"), a = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), b = s("species"), v = [].slice, p = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(h, m) {
        var g, E, C, w = u(this), O = c(w.length), y = t(h, O), j = t(m === void 0 ? O : m, O);
        if (o(w) && (g = w.constructor, typeof g != "function" || g !== Array && !o(g.prototype) ? r(g) && (g = g[b], g === null && (g = void 0)) : g = void 0, g === Array || g === void 0)) return v.call(w, y, j);
        for (E = new (g === void 0 ? Array : g)(p(j - y, 0)), C = 0; y < j; y++, C++) y in w && a(E, C, w[y]);
        return E.length = C, E;
      } });
    }, fc6a: function(i, f, e) {
      var n = e("44ad"), r = e("1d80");
      i.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(i, f) {
      i.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(i, f, e) {
      var n = e("4930");
      i.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(i, f, e) {
      var n = e("da84");
      i.exports = n.Promise;
    } });
  });
})(Ct);
var Kn = Ct.exports;
const Tt = /* @__PURE__ */ Wn(Kn);
Nt({
  components: { KeyBoard: Tt },
  setup() {
    function ge(ne, te) {
      console.log("change value ---->", ne), console.log("change input dom ---->", te);
    }
    return {
      change: ge
    };
  }
});
const Qn = { class: "wifi-component" }, Hn = { class: "row" }, Gn = { class: "column" }, Yn = { class: "column" }, Xn = { class: "status" }, Jn = { class: "row" }, Zn = { class: "column" }, er = {
  __name: "WiFi",
  setup(ge) {
    const ne = se("未连接"), te = se(""), i = se(""), f = () => {
      alert("验证 WiFi: " + te.value);
    }, e = () => {
      alert("连接到 WiFi: " + te.value), ne.value = "已连接到 " + te.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? te.value = r : o.placeholder === "WiFi 密码" && (i.value = r);
    };
    return (r, o) => (Ae(), Le("div", Qn, [
      M("div", Hn, [
        M("div", Gn, [
          dt(M("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => te.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [pt, te.value]
          ])
        ]),
        M("div", Yn, [
          M("div", Xn, " WiFi 状态: " + De(ne.value), 1)
        ])
      ]),
      M("div", Jn, [
        M("div", Zn, [
          dt(M("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => i.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [pt, i.value]
          ])
        ]),
        M("div", { class: "column" }, [
          M("div", { class: "button-group" }, [
            M("button", { onClick: f }, "验证 WiFi"),
            M("button", { onClick: e }, "连接 WiFi")
          ])
        ])
      ]),
      He(Pt(Tt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: n,
        class: "scaled-keyboard"
      })
    ]));
  }
}, tr = /* @__PURE__ */ ot(er, [["__scopeId", "data-v-38505ad0"]]), nr = {
  key: 0,
  class: "numeric-keyboard"
}, rr = { class: "keyboard" }, or = { class: "current-value" }, ir = ["onClick"], ar = {
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
  setup(ge, { emit: ne }) {
    const te = ge, i = ne, f = se([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = se("");
    st(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ge.showKeyboard ? (Ae(), Le("div", nr, [
      M("div", rr, [
        M("div", or, De(e.value), 1),
        (Ae(!0), Le(at, null, ct(f.value, (t) => (Ae(), Le("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ae(!0), Le(at, null, ct(t, (c) => (Ae(), Le("button", {
            key: c,
            onClick: (u) => n(c),
            class: it({ "function-key": c === "清除" || c === "确定" })
          }, De(c), 11, ir))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, Ot = /* @__PURE__ */ ot(ar, [["__scopeId", "data-v-2ccc1cb7"]]), cr = { class: "container" }, ur = { class: "column" }, sr = { class: "status-bar" }, lr = ["disabled"], fr = { class: "column" }, dr = {
  key: 0,
  class: "modal"
}, pr = { class: "modal-content" }, vr = 60, hr = {
  __name: "Lock",
  setup(ge) {
    const { sendToPyQt: ne } = rt(), te = vt({
      isPyQtWebEngine: !1
    }), i = se("未激活"), f = se(0), e = se(""), n = se(""), r = se(""), o = se(!1);
    let t, c;
    const u = se(0), a = se(1), s = se(null), l = se(!1), d = se(!1), b = bt(() => i.value === "未激活" ? "设备状态: 未激活" : i.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${a.value} 次锁定 - 剩余时间: ${v.value}`), v = bt(() => {
      const N = Math.floor(f.value / 86400), _ = Math.floor(f.value % (24 * 60 * 60) / (60 * 60)), T = Math.floor(f.value % (60 * 60) / 60), Y = f.value % 60;
      return `${N}天 ${_.toString().padStart(2, "0")}:${T.toString().padStart(2, "0")}:${Y.toString().padStart(2, "0")}`;
    }), p = bt(() => i.value === "未激活" ? "按住以激活设备" : e.value);
    function h(N) {
      i.value === "未激活" && (N.target.setPointerCapture(N.pointerId), u.value = 0, c = setInterval(() => {
        u.value += 2, u.value >= 100 && (clearInterval(c), E());
      }, 30));
    }
    function m(N) {
      N.target.releasePointerCapture(N.pointerId), g();
    }
    function g() {
      clearInterval(c), u.value = 0;
    }
    function E() {
      ne("activate_device", {});
    }
    function C(N, _) {
      i.value = "已激活", e.value = N, s.value = new Date(_), w();
    }
    function w() {
      O(), t = setInterval(() => {
        f.value > 0 ? f.value-- : y();
      }, 1e3);
    }
    function O() {
      const N = /* @__PURE__ */ new Date(), _ = new Date(s.value.getTime() + a.value * vr * 1e3);
      f.value = Math.max(0, Math.floor((_ - N) / 1e3));
    }
    function y() {
      o.value = !0, clearInterval(t);
    }
    function j() {
      ne("check_lock_password", {
        target: "attemptUnlock",
        password: n.value,
        lockCount: a.value,
        deviceRandomCode: e.value
      }), n.value = "";
    }
    function S() {
      ne("check_lock_password", {
        target: "attemptModalUnlock",
        password: r.value,
        lockCount: a.value,
        deviceRandomCode: e.value
      }), r.value = "";
    }
    function A() {
      i.value = "永久激活", o.value = !1, clearInterval(t);
    }
    function k() {
      a.value++, t && clearInterval(t), w();
    }
    return St(() => {
      clearInterval(t), clearInterval(c);
    }), ut(() => {
      if (te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: N } = rt();
        st(N, (_) => {
          if (_ && _.type === "confirm_lock_password")
            try {
              const T = JSON.parse(_.content);
              T.target === "attemptUnlock" ? T.result === "success" ? k() : T.result === "forever_success" ? A() : alert("密钥错误") : T.target === "attemptModalUnlock" && (T.result === "success" ? (o.value = !1, k()) : T.result === "forever_success" ? A() : T.result === "fail" && alert("密钥错误"));
            } catch (T) {
              console.error("Failed to parse confirm lock password :", T);
            }
          else if (_ && _.type === "device_activated")
            try {
              const T = JSON.parse(_.content);
              C(T.device_random_code, T.device_base_time);
            } catch (T) {
              console.error("Failed to parse device activation result:", T);
            }
          else if (_ && _.type === "device_info")
            try {
              const T = JSON.parse(_.content);
              i.value = T.device_status, e.value = T.device_random_code, a.value = T.device_lock_count, s.value = new Date(T.device_base_time), T.device_status === "已激活" ? w() : T.device_status === "永久激活" && A();
            } catch (T) {
              console.error("Failed to parse device status:", T);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    }), (N, _) => (Ae(), Le("div", cr, [
      M("div", ur, [
        M("div", sr, De(b.value), 1),
        M("button", {
          class: "activation-button",
          onPointerdown: h,
          onPointerup: m,
          onPointercancel: g,
          onPointerleave: g,
          disabled: i.value !== "未激活"
        }, [
          Bt(De(p.value) + " ", 1),
          M("div", {
            class: "progress-bar",
            style: wt({ width: u.value + "%" })
          }, null, 4)
        ], 40, lr)
      ]),
      M("div", fr, [
        dt(M("input", {
          "onUpdate:modelValue": _[0] || (_[0] = (T) => n.value = T),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: _[1] || (_[1] = (T) => l.value = !0)
        }, null, 544), [
          [pt, n.value]
        ]),
        M("button", {
          class: "unlock-button",
          onClick: j
        }, "解锁")
      ]),
      o.value ? (Ae(), Le("div", dr, [
        M("div", pr, [
          _[8] || (_[8] = M("h3", null, "设备已锁定", -1)),
          M("h3", null, "第 " + De(a.value) + " 次锁定", 1),
          M("h3", null, "设备随机码: " + De(e.value), 1),
          dt(M("input", {
            "onUpdate:modelValue": _[2] || (_[2] = (T) => r.value = T),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: _[3] || (_[3] = (T) => d.value = !0)
          }, null, 544), [
            [pt, r.value]
          ]),
          M("button", {
            class: "unlock-button",
            onClick: S
          }, "解锁")
        ])
      ])) : ft("", !0),
      He(Ot, {
        modelValue: n.value,
        "onUpdate:modelValue": _[4] || (_[4] = (T) => n.value = T),
        showKeyboard: l.value,
        "onUpdate:showKeyboard": _[5] || (_[5] = (T) => l.value = T)
      }, null, 8, ["modelValue", "showKeyboard"]),
      He(Ot, {
        modelValue: r.value,
        "onUpdate:modelValue": _[6] || (_[6] = (T) => r.value = T),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": _[7] || (_[7] = (T) => d.value = T)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, mr = /* @__PURE__ */ ot(hr, [["__scopeId", "data-v-28624ff1"]]), gr = { class: "app-container" }, br = {
  __name: "App",
  setup(ge) {
    return Rt(), (ne, te) => (Ae(), Le("div", gr, [
      te[0] || (te[0] = M("h1", null, "涪特智能养护台车控制系统", -1)),
      He(yn),
      He(qn),
      He(on),
      He(In),
      He(tr),
      He(mr)
    ]));
  }
};
export {
  br as default
};
