// client-side js
// run by the browser each time your view template is loaded

console.log('hello world :o');

var gun = new Gun({
  localStorage: false,
  radix: false,
  radisk: false,
  peers: ["http://localhost:5810/gun"],
});

if (!Vue) // You Don't actually need this, Its just nice so that the editor dosen't think Vue is not defined
  var Vue = () => { };


Vue.component('my-checkbox', {
  template: '#checkbox-template',
  data() {
    return {
      checked: false,
      title: 'Check me'
    }
  },
  methods: {
    check() {
      this.checked = !this.checked;
    }
  }
});

Vue.component('widget-camera', {
  props: ["stream-source", "type"],
  template: '#widget-camera',
  data() {
    return {
      
    }
  },
  computed: {
    source: function () {
      return this.streamSource;
    }
  }
})

Vue.component('widget-status', {
  props: ["status"],
  template: '#widget-status',
  data() {
    return {
      
    }
  },
  
})

Vue.component('widget-values', {
  props: ["values"],
  template: '#widget-values',
  data() {
    return {
      
    }
  },
  methods: {
    getValue: function (valueName) {
      //console.log(this.values[this.valuenames.indexOf(valueName)]);
      //return this.values[this.valuenames.indexOf(valueName)];

    }
  }
})

new Vue({
  el: '#app',
  data: {
    message: 'Hello World!',
    showMessage: true,

    fullDisplay: true,
    fullMessage: "No Connection",

    status: 0, // 0 or 1 if no connection, 2 if connected
    color: '#673AB7', // our background color for the page, will turn based on status of the dashboard,

    robotStatus: true,
    robotValues: [],

    cameratop : "http://10.45.50.36:1181/stream.mjpg",
    camerabot : "http://10.45.50.36:1182/stream.mjpg",
  },
  computed: {
    computedMethod: function () {
      return this.message + " I Love Vue!";
    },
    statusColor: function () {
      if (this.status == 0) // Not Connected
        return "#2f95bd";
      else if (this.status == 1) // Connected
        return "#18c44e";
    }
  },
  methods: {
    myMethod: function () {
      let self = this; // This is really nice when using stuff like callbacks
    },
    setBackgroundColor: function () {
      //console.log("Hello From setBackroundColor!");

      //console.log(this.color);
    },
    reloadImages: function () {
      console.log("Reloading images");
      this.cameratop = "http://10.45.50.36:1181/stream.mjpg?" + Date.now();
      this.camerabot = "http://10.45.50.36:1182/stream.mjpg?" + Date.now();
      console.log("http://10.45.50.36:1182/stream.mjpg?" + Date.now());
    },
  },
  created() {
    var self = this;

    this.setBackgroundColor();
    //console.log(this);

    gun.get("ElementDashboard").on(function (val, key) {
      //console.log(key);
      for(var key in val) {
        if(key != "_") {
          console.log(key + " : " + val[key]);

          var item = self.robotValues.find(function(el) {
            return el.name == key;
          })

          if(item != undefined) {
            item = self.robotValues.indexOf(item);
          }

          if(item == undefined) {
            self.robotValues.push({
              "name": key,
              "value": val[key],
            })
          } else {
            Vue.set(self.robotValues, item, {
              "name": key,
              "value": val[key],
            });
          }

          if(key == "rstatus") {
            console.log("Reloading cameras");
            self.reloadImages();
          }
        }
      }
    });
  }
});