(function(){
 let index=null,active=null,timer=null,token=0;
 const players={};
 function status(text){document.querySelector('#status').textContent=text}
 function stop(){token++;clearInterval(timer);timer=null;if(active){active.pause();active.onloadedmetadata=null;active.onseeked=null;active.onerror=null;active.muted=false}active=null;if(window.speechSynthesis)window.speechSynthesis.cancel()}
 function setup(data){index=data}
 function play(id,sentence,slow){
  const kind=sentence?'sentences':'words',clip=index?.entries?.[String(id)]?.[kind];
  if(!clip)return false;
  stop();const own=token;let a=players[clip.file];if(!a){a=new Audio();a.preload='metadata';a.setAttribute('playsinline','');a.hidden=true;a.setAttribute('aria-hidden','true');a.src=clip.file;document.body.appendChild(a);players[clip.file]=a}active=a;a.playbackRate=slow?.8:1;a.preservesPitch=true;
  status('正在加载音频…');
  function failed(){if(own!==token)return;stop();status('音频未能播放，请检查网络和音量后再次点击；微信内仍无声时可用右上角菜单在浏览器打开。')}
  const monitor=()=>{if(own!==token)return;a.muted=false;status(slow?'正在慢速播放…':'正在播放…');clearInterval(timer);timer=setInterval(()=>{if(own!==token)return;if(a.currentTime>=clip.end){a.pause();clearInterval(timer);timer=null;status('播放完成，可以再听一次。')}},40)};
  const seek=()=>{if(own!==token)return;try{a.onseeked=monitor;a.currentTime=clip.start;if(Math.abs(a.currentTime-clip.start)<.05&&!a.seeking)monitor()}catch{failed()}};
  a.onerror=failed;
  if(a.readyState>=1)seek();else{a.muted=true;a.onloadedmetadata=seek}
  // Call play directly from the student's tap, preserving mobile user activation.
  try{const started=a.play();if(started?.catch)started.catch(failed)}catch{failed()}
  return true;
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.WordSenseAudio={setup,play,stop};
})();
