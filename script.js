
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
      selectedlist = []
      // Toggle class item to be either selected or non-selected
      if (event.target.className === "unselected-course") {
        event.target.className = "selected-course";
      } else {
        event.target.className = "unselected-course";
      }

      const allselecteddom = document.getElementsByClassName('selected-course');

      for (const selecteddom of allselecteddom) {

        totalCredits += parseInt(selecteddom.getAttribute("data-coursecredit"));

        const course = new model.Course(
          parseInt(selecteddom.getAttribute("data-courseid")),
          parseInt(selecteddom.getAttribute("data-coursecredit")),
          selecteddom.getAttribute("data-coursename"),
          selecteddom.getAttribute("data-coursetype"),
        )

        selectedlist.push(course);
      }

      console.log(selectedlist)

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
  };

  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();
