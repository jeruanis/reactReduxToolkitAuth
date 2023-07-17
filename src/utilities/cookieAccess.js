import React,{ useEffect } from 'react';


// Function to set a cookie with a given name, value, and expiration time with value from server
export const useSetTokenCookie = ({ name, value, expirationDays }) => {
  useEffect(() => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const cookieValue = encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
    document.cookie = name + '=' + cookieValue;
  }, [name, value, expirationDays]);
};


export const useGetTokenCookie = (name) => {
//   useEffect(() => {
    const cookieName = name + '=';
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }

      if (cookie.indexOf(cookieName) === 0) {
        return decodeURIComponent(cookie.substring(cookieName.length));
      }
    }
    //if no cookie found
     return null;
//   }, [name]);
};



export const useRemoveCookie = (name) => {
  useEffect(() => {
    const removeCookie = () => {
      const cookieValue = encodeURIComponent(name) + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = cookieValue;
    };

    removeCookie();
  }, [name]);


  // useEffect(() => {
  //   const removeCookie = () => {
  //     document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  //   };
  //   removeCookie();
  // }, [name]);
  
};
