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
        
                  <div class="modal-footer row">
                    <slot name="footer">
                          <div class="col-md-9 "></div>
                          <div class="col-md-3 ">
                                <button class="btn btn-primary buttonForm " @click="$emit('close')">
                                   Close
                                </button>
                           </div>
                    </slot>
                  </div>
                </div>
              </div>
            </div>
          </transition>`
})