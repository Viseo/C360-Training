Vue.component('saveModal', {
    template:
        `
          <transition name="saveModal">
            <div class="modal-mask">
              <div class="modal-wrapper">
                <div class="modal-container">
        
                  <div class="modal-header">
                    <slot name="header">
                    </slot>
                  </div>
        
                  <div>
                    <slot name="body">
                    </slot>
                  </div>
                  <div>
                    <slot name="body2">
                    </slot>
                  </div>
        
                  <div class="modal-footer">
                    <slot name="footer">
                        <button class="modal-default-button" @click="$emit('close')">
                           OK
                         </button>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
          </transition>`
})