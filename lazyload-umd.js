function getAuth(){
  microsoftTeams.authentication.authenticate(
    {
      url:"https://teams.hipdf.com/teams-auth",width:600,height:535,
      successCallback:function(t){
        console.log(t,"result"),localStorage.setItem("simple.result",JSON.stringify(t)),location.href="/"
      },
      failureCallback:function(t){
        console.log(t,"reason")}})}localStorage.getItem("simple.result")&&(window.location.href="/"),
  microsoftTeams.initialize()