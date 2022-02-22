#fonts
Google
handw:
font-family: 'Comfortaa', cursive;
code:
font-family: 'Roboto Mono', monospace;
broke:
font-family: 'Source Sans Pro', sans-serif;
font-family: 'Montserrat', sans-serif;

Css
code:
font-family: 'Courier New', monospace;
general:
font-family: Geneva, Verdana, sans-serif;

#colors
tesh: #aaeeff






<!DOCTYPE html>
<html>
<head>
 <title>My Discord OAuth2 App</title>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
 <div id="info">
  Hoi!
 </div>
 <!-- https://discord.com/api/oauth2/authorize?client_id=928046206502977636&redirect_uri=https%3A%2F%2Fservice-8453.something.gg&response_type=token&scope=identify%20guilds%20guilds.members.read
               -->
 <!-- https://discord.com/api/oauth2/authorize?client_id=869927535473995857&redirect_uri=http%3A%2F%2Flocalhost%3A20000%2F&response_type=token&scope=identify%20guilds%20guilds.members.read
               -->
 <a id="login" style="display: none;" href="https://discord.com/api/oauth2/authorize?client_id=869927535473995857&redirect_uri=http%3A%2F%2Flocalhost%3A20000%2F&response_type=token&scope=identify%20guilds%20guilds.members.read">Identify Yourself</a>
 <script>
  window.onload = () => {
   const fragment = new URLSearchParams(window.location.hash.slice(1));
   const [accessToken,
    tokenType] = [fragment.get('access_token'),
    fragment.get('token_type')];

   if (!accessToken) {
    return document.getElementById('login').style.display = 'block';
   }

   fetch('https://discord.com/api/users/@me', {
    headers: {
     authorization: `${tokenType} ${accessToken}`,
    },
   })
   .then(result => result.json())
   .then(response => {
    const {
     username, discriminator
    } = response;
    localStorage['myKey'] = ` ${username}#${discriminator}`;
    document.getElementById('info').innerText += localStorage['myKey'];

   })
   .catch(console.error);
  };
 </script>
 <a href="home.html">home.html</a>

</body>
</html>