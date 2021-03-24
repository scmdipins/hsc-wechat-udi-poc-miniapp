Component({
  
  properties: {

  },

  data: {

  },

  methods: {

    showHintModal: function () {
      this.setData({
        showHintModal: true
      })
    },

    hideHintModal: function () {
      this.setData({
        showHintModal: false
      })
    },

    confirm() {
      this.hideHintModal()
    }
  }
})
