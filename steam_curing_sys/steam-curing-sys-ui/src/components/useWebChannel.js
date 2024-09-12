// useWebChannel.js
import { ref, provide, inject, onMounted, readonly } from 'vue'

const channelSymbol = Symbol()
const bridgeSymbol = Symbol()
const messageSymbol = Symbol()

function setupMessageListener(bridge, messageRef) {
  if (bridge && bridge.messageSignal) {
    bridge.messageSignal.connect((msg) => {
      try {
        const parsedMsg = JSON.parse(msg);
        messageRef.value = parsedMsg;
        console.log('Received message from PyQt:', parsedMsg);
      } catch (error) {
        console.error('Failed to parse message:', error);
        messageRef.value = { type: 'unknown', content: msg };
      }
    });
  } else {
    console.error('messageSignal not found on bridge');
  }
}

export function provideWebChannel() {
  const channel = ref(null)
  const bridge = ref(null)
  const message = ref('')

  function initQWebChannel() {
    if (window.QWebChannel) {
      new QWebChannel(window.qt.webChannelTransport, (ch) => {
        channel.value = ch
        bridge.value = ch.objects.bridge
        console.log('QWebChannel initialized', ch, ch.objects.bridge)
        
        // Set up message listener
        setupMessageListener(bridge.value, message)

        // Notify PyQt that Vue is ready
        if (bridge.value && typeof bridge.value.vueReady === 'function') {
          bridge.value.vueReady()
        } else {
          console.error('vueReady method not found on bridge')
        }
      })
    } else {
      console.error('QWebChannel not found')
    }
  }

  onMounted(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      initQWebChannel()
    } else {
      document.addEventListener('DOMContentLoaded', initQWebChannel)
    }
  })

  provide(channelSymbol, readonly(channel))
  provide(bridgeSymbol, readonly(bridge))
  provide(messageSymbol, readonly(message))
}

export function useWebChannel() {
  const channel = inject(channelSymbol)
  const bridge = inject(bridgeSymbol)
  const message = inject(messageSymbol)

  if (!channel || !bridge || !message) {
    console.error('WebChannel not properly provided. Make sure to call provideWebChannel in a parent component.')
  }

  const sendToPyQt = (methodName, args) => {
    console.log(`Attempting to call ${methodName} with args:`, args)
    if (bridge && bridge.value) {
      if (typeof bridge.value.sendToPyQt === 'function') {
        try {
          bridge.value.sendToPyQt(methodName, JSON.stringify(args))
        } catch (error) {
          console.error(`Error calling sendToPyQt:`, error)
        }
      } else {
        console.error(`Method sendToPyQt not available on bridge`)
        console.log('Available methods:', Object.keys(bridge.value))
      }
    } else {
      console.error(`Bridge or bridge.value is undefined`)
    }
  }

  return {
    channel,
    bridge,
    message,
    sendToPyQt
  }
}