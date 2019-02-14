import Left from "../layout/Left.js";
import Right from "../layout/Right.js";
import UserCss from "../../assets/js/cssx/users.css.js";
import IsAdmin from "../auth/IsAdmin.js";
import Load from "../common/Load.js";
import Field from "../common/DashboardField.js";

class EditProfile{
  async getData(){
    try {
      const response=await fetch(`http://localhost:5000/api/v1/users/current/user`,{
        method:"GET",
        headers:{
          "Accept":"application/json,*/*",
          "Content-type":"application/json",
          "Authorization":getToken()
        }
      });
      const data=await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  async render(){
    const userData=await this.getData();
    const currentUser=userData ? userData.user: [];
    const body = document.querySelector("body");
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "/src/assets/js/function/profile.js");
    body.appendChild(script);
    const template=(`
      ${UserCss}
      ${Load}
      ${Left}
      <section class="right-side">
      ${Right}
      <!--profile!-->
      <div class="editAccount">
        <!--!-->
        <div class="other-proInfo">
          <div class="otherproHeader">
            <h3>Edit Your Profile Information</h3>
          </div>
          <div class="moreInfo">
            <form class="forms" onsubmit="return UpdateUserInfo(event)">
              <div class="editForm">
              ${Field({
                label:"First Name",
                type:"text",
                name:"firstname",
                value:`${currentUser ? currentUser.firstname:""}`,
                placeholder:"your firstname",
                keys:"firstname-error"
              })}
              </div>
              <div class="editForm">
              ${Field({
                label:"Last Name",
                type:"text",
                name:"lastname",
                value:`${currentUser ? currentUser.lastname:""}`,
                placeholder:"your lastname",
                keys:"lastname-error"
              })}
              </div>
              <div class="editForm">
              ${Field({
                label:"Username",
                type:"text",
                name:"username",
                value:`${currentUser ? currentUser.username:""}`,
                placeholder:"your username",
                keys:"username-error"
              })}
              </div>
              <div class="editForm">
              ${Field({
                label:"Email",
                type:"email",
                name:"email",
                value:`${currentUser ? currentUser.email:""}`,
                placeholder:"your email",
                keys:"email-error"
              })}
              </div>
              <div class="editForm">
              ${Field({
                label:"phone number",
                type:"number",
                name:"phoneNumber",
                value:`${currentUser ? currentUser.phonenumber:""}`,
                placeholder:"your phone number",
                keys:"phone-error"
              })}
              </div>
             <button type="submit" name="profileInfo" class="closeAccountBtn">Update profile</button>
             <h5 class="savedMsg profileInfo"></h5>
            </form>
          </div>
        </div>
      </div>
      <!--password!-->
      <div class="editAccount">
        <!--!-->
        <div class="other-proInfo">
          <div class="otherproHeader">
            <h3>Change Your Password</h3>
          </div>
          <div class="moreInfo">
            <form class="forms" onsubmit="return UpdatePassword(event)">
              <div class="editForm">
              ${Field({
                label:"Recent password",
                type:"password",
                name:"recentpassword",
                value:``,
                placeholder:"your recent password",
                keys:"recent-error"
              })}
              </div>
              <div class="editForm">
              ${Field({
                label:"New password",
                type:"password",
                name:"newpassword",
                value:``,
                placeholder:"your new password",
                keys:"password-error"
              })}
              </div>
            <button type="submit" name="passwordInfo" class="closeAccountBtn">save change</button>
            <h5 class="savedMsg passwordInfo"></h5>
            </form>
          </div>
        </div>
      </div>
      </section>
    `);
    return template;
  }
}
export default new EditProfile();