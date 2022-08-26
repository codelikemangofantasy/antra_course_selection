
import { Api } from './api.js'

/* ~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~ */
const View = (() => {
  const domstr = {
    candidateContainer: '#courselist_containter',
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
    #selectedlist = [];

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

      // Toggle class item to be either selected or non-selected
      if (event.target.className === "unselected-course") {
        event.target.className = "selected-course";
      } else {
        event.target.className = "unselected-course";
      }

      const allselecteddom = document.getElementsByClassName('selected-course');

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
      // selectButton.disabled = true;
      debugger;
      const allselecteddom = document.getElementsByClassName('selected-course');

      for (const selecteddom of allselecteddom) {
        const course = new model.Course(
          parseInt(selecteddom.getAttribute("data-courseid")),
          selecteddom.getAttribute("data-coursename"),
          selecteddom.getAttribute("data-coursetype"),
          parseInt(selecteddom.getAttribute("data-coursecredit")),
        )
        selectedlist.push(course);
      }

      console.log(selectedlist)

      let tmp = '';
      selectedlist.forEach((course) => {
        tmp += `
          <li class="unselected-course" data-courseid="${course.courseId}" data-coursecredit="${course.credit}" data-coursetype="${course.required ? "Compulsory" : "Elective"}" data-coursename="${course.courseName}">
            <div class="attr-container">
              <div>${course.courseName}</div>
              <div>Course Type: ${course.required ? "Compulsory" : "Elective"}</div>
              <div>Course Credit: ${course.courseCredit}</div>
            </div>
          </li>
        `;
      });

      let selectedcourselistContainer = document.getElementById("selectedcourselist_container");
      selectedcourselistContainer.innerHTML = tmp;

    })
  }

  // const addTodo = () => {
  //   const inputbox = document.querySelector(view.domstr.inputebox);
  //   inputbox.addEventListener('keyup', (event) => {
  //     if (event.key === 'Enter' && event.target.value.trim()) {
  //       const newTodo = new model.Todo(event.target.value);
  //       model.addTodo(newTodo).then(todo => {
  //         state.todolist = [todo, ...state.todolist];
  //       });
  //       event.target.value = '';
  //     }
  //   });
  // };

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
