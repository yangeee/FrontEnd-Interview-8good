function sleep(time) {
  const endTime = new Date().getTime() + time;
  while(new Date().getTime() < endTime) {}
}

sleep(2000);

sleep(2000);
document.getElementById('998').innerText = 'sss'

