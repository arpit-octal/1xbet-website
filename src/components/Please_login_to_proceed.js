import React from "react"; 
  
function Please_login_to_proceed() {
  return ( 
        <>
        <div id="loginToGoApi" className="overlay" style={{display:"none"}}>
            <div className="pop-wrap message-to-login">
              <h4>Please login to proceed</h4>
              <ul className="btn-list">
                <li>
                  <a href="#" className="btn-send ui-link">OK</a>
                </li>
              </ul>
            </div>
          </div>
      </>
  );
}

export default Please_login_to_proceed;
