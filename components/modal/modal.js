Component({
  properties: {
    show: {
      type: Boolean,
      value: !1,
      observer: function(t) {
        var o = this;
        t ? this.setData({
          showModal: !0
        }) : this.setData({
          opacity: 0
        }), this.animationTimeout = setTimeout(function() {
          t ? o.setData({
            opacity: 1
          }) : o.setData({
            showModal: !1
          });
        }, t ? 5 : 200);
      }
    },
    backgroundColor: String,
    clickToClose: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    opacity: 0
  },
  lifetimes: {
    detached: function() {
      clearTimeout(this.animationTimeout);
    }
  },
  methods: {
    onOverlayClick: function() {
      this.properties.clickToClose && this.triggerEvent("close");
    }
  }
});