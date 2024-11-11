import { Notify } from "quasar";

export const fireNotify = ( message, group= 'created', position= 'bottom', duration = 1000, type = 'positive' ) => {
  Notify.create({
    group: group,
    position:position,
    type: type,
    textColor: 'white',
    message: message,
    timeout: duration,
    progress: true,
    classes: '',
    badgeStyle:'display: none',
    actions: [
      { icon: 'close',
        color: 'white',
        handler: () => {
          /* ... */
        }
      }
    ],
    attrs: {
      role: 'alertdialog',
    }
  })
}

