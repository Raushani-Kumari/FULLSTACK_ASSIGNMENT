export async function loginUser(payload) {
    return fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log("error ", error.message);
        throw error;
      });
  }
  
  export async function registerUser(payload) {
    return fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log("error : ", error.details[0].message);
        throw error;
      });
  }
  
  export async function getCurrentUser(jwt) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
  
    return fetch("https://resellhub.azurewebsites.net/api/users/me", requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  
  
  }
  