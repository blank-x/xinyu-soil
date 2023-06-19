import {onMounted, onUnmounted, ref} from 'vue'

export default function (){
  const angle = ref(0)
  let orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
  function resize(){
    angle.value = orientation.angle;
  }
  let event = "onorientationchange"in window ? "orientationchange" : "resize"
  onMounted(()=>{window.addEventListener(event, resize);})
  onUnmounted(()=>{window.removeEventListener(event, resize);})

  return angle
}
