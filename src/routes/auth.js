//import jwt from 'jwt-simple';
import jwt from 'jsonwebtoken';
import request from 'request';

let auth = {
  tokensignin: (req, res) => {

    let accessToken = req.body.accessToken || '',
        loginService = req.body.loginService || '',
        email = req.body.email || '';

    let tokenInfoEndpoint;

    if (loginService == 'google') {
      // NOTE: Could be a security issue if the accessToken is misused
      // for function calls.
      tokenInfoEndpoint
        = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='
    } else if (loginService == 'facebook') {
      tokenInfoEndpoint = 'https://graph.facebook.com/app?access_token='
    }

    let tokenVerifyURL = `${tokenInfoEndpoint}${accessToken}`;

    // Verify if the token is valid with the endpoint
    request(tokenVerifyURL, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        // collect user data from the db and return it
        //
        //
        let profile = {
          name: dbResult.name,
          email: dbResult.email,
          userId: dbResult.userId
        }

        let token = jwt.sign(profile, 'nyancat', { expiresInMinutes: 60*5 });
        res.json({ token: token });
      } else {
        res.send(401, 'Invalid token');
      }
    })

  }
}


/*
function genToken(user) {
  let expires = exporesIn(7);
  let token = jwt.encode({
      exp: expires
    }, 'nyancat');

  return {
    token: token,
    expores: expires,
    user: user
  };
}

function expiresIn(numDays) {
  let dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
*/

export { auth };
