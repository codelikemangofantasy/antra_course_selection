/* ~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~ */
export const Api = (() => {
    // const baseUrl = 'https://jsonplaceholder.typicode.com';
    const baseUrl = 'http://localhost:4232';
    const courseList = 'courseList';
  
    const getCourseList = () =>
        fetch([baseUrl, courseList].join('/')).then((response) => response.json());    

    return {
      getCourseList
    };
  })();