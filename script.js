
import { Api } from './api.js'

/* ~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ */
const View = (() => {
  const domstr = {
    candidateContainer: '#courselist_containter',
    selectedContainer: "#selectedcourselist_container",
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = '';
    arr.forEach((course) => {
      tmp += `
        <li class="unselected-course" data-courseid="${course.courseId}" data-coursecredit="${course.credit}" data-coursetype="${course.required ? "Compulsory" : "Elective"}" data-coursename="${course.courseName}">
          <div class="attr-container">
            <div>${course.courseName}</div>
            <div>Course Type: ${course.required ? "Compulsory" : "Elective"}</div>
            <div>Course Credit: ${course.credit}</div>
          </div>
        </li>
      `;
    });
    return tmp;
  };

  return {
    domstr,
    render,
    createTmp,
  };
})();

/* ~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~ */
const Model = ((api, view) => {
  class Course {
    constructor(course_id, course_name, course_type, course_credit) {
      this.courseId = course_id;
      this.courseName = course_name;
      this.courseType = course_type;
      this.courseCredit = course_credit;
    }
  }
  class State {
    #candidatelist = [];

    get candidatelist() {
      return this.#candidatelist;
    }
    set candidatelist(newcandidatelist) {
      this.#candidatelist = [...newcandidatelist];

      const candidateContainer = document.querySelector(view.domstr.candidateContainer);
      const tmp = view.createTmp(this.#candidatelist);
      view.render(candidateContainer, tmp);
    }
  }

  const { getCourseList } = api;

  return {
    Course,
    State,
    getCourseList
    // addTodo,
  };
})(Api, View);

/* ~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~ */
const Controller = ((model, view) => {
  const state = new model.State();
  let selectedlist = [];

  const toggleCourse = () => {
    const candidateContainer = document.querySelector(view.domstr.candidateContainer);
    let totalCredits = 0;
    let selectedlist = [];
    
    candidateContainer.addEventListener('click', (event) => {
      totalCredits = 0;
      document.getElementById("sum-of-credit").innerHTML = totalCredits;

      let allselecteddom = document.getElementsByClassName('selected-course');

      if (event.target.className === "unselected-course") {
        for (const selecteddom of allselecteddom) {
          totalCredits += parseInt(selecteddom.getAttribute("data-coursecredit"));
        }
        if (totalCredits + parseInt(event.target.getAttribute("data-coursecredit")) > 18) {
          alert("You cannot choose more than 18 credits in one semester!");
          document.getElementById("sum-of-credit").innerHTML = totalCredits;
          return
        }
      }

      totalCredits = 0;

      // Toggle class item to be either selected or non-selected
      if (event.target.className === "unselected-course") {
        event.target.className = "selected-course";
      } else {
        event.target.className = "unselected-course";
      }

      allselecteddom = document.getElementsByClassName('selected-course');

      for (const selecteddom of allselecteddom) {
        totalCredits += parseInt(selecteddom.getAttribute("data-coursecredit"));
        document.getElementById("sum-of-credit").innerHTML = totalCredits;
      }
    })

  }

  const confirmSelect = () => {
    const selectButton = document.getElementById("select-button");
    
    selectButton.addEventListener('click', (event) => {    
      let selectedlist = [];
      let nonselectedlist = [];
      let totalCredits = 0;

      // Collect all selected courses
      const allselecteddom = document.getElementsByClassName('selected-course');

      for (const selecteddom of allselecteddom) {
        totalCredits += parseInt(selecteddom.getAttribute("data-coursecredit"));
        const course = new model.Course(
          parseInt(selecteddom.getAttribute("data-courseid")),
          selecteddom.getAttribute("data-coursename"),
          selecteddom.getAttribute("data-coursetype"),
          parseInt(selecteddom.getAttribute("data-coursecredit")),
        )
        selectedlist.push(course);
      }

      // Collect all non-selected courses
      const allnonselecteddom = document.getElementsByClassName('unselected-course');

      for (const nonselected of allnonselecteddom) {
        const course = new model.Course(
          parseInt(nonselected.getAttribute("data-courseid")),
          nonselected.getAttribute("data-coursename"),
          nonselected.getAttribute("data-coursetype"),
          parseInt(nonselected.getAttribute("data-coursecredit")),
        )
        nonselectedlist.push(course);
      }

      if (confirm("You have chosen " + totalCredits + " credits for this semester. You cannot change once you submit. Do you want to confirm?")) {

        // Disable select button only after confirming selection
        event.target.disabled = true;

        // Re-render selected courses
        const selectedcourselistContainer = document.querySelector(view.domstr.selectedContainer);
        const tmpSelected = view.createTmp(selectedlist);
        view.render(selectedcourselistContainer, tmpSelected);
        // Re-render non-selected courses
        const candidateContainer = document.querySelector(view.domstr.candidateContainer);
        const tmpNonselected = view.createTmp(nonselectedlist);
        view.render(candidateContainer, tmpNonselected);
      }
    })
  }

  const init = () => {
    model.getCourseList().then((courses) => {
      state.candidatelist = [...courses];
    });

  };

  const bootstrap = () => {
    init();
    toggleCourse();
    confirmSelect();
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
