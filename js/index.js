let loading,
    contentAll;

const colorPositive = "#4ca64c",
      colorNegative = "#ff6666";

document.addEventListener('DOMContentLoaded', function() {
  try {
    let btnLogin = findId("login"),
        btnClose = findId("close"),
        btnCourse = findId('tab-course'),
        btnPayments = findId('tab-payments');

    loading = findId('load');
    contentAll = findId('content-all');

    btnLogin.onclick = actionNewTab;
    btnClose.onclick = actionClose;
    btnCourse.onclick = actionTabCourse;
    btnPayments.onclick = actionTabPayments;

    requestTabCourse(urlCourse);
  } catch(err) {
    actionClose();
  }
});

function findId(query, context = document) {
  return context.getElementById(query);
}

function authUser(dom, fn) {
  const isLogged = (dom.split(': ').pop().replace(/\s/g, '') === 'Históricoacadêmico');
  const isAuth = (dom.split(': ').pop().replace(/\s/g, '') !== '');

  fn({isLogged: isLogged, isAuth: isAuth});
}

function actionNewTab() {
  chrome.tabs.create({active: true, url: this.dataset.url});
}

function actionClose() {
  window.close();
}

function actionTabCourse() {
  this.parentNode.dataset.selectedTab = '1';
  requestTabCourse();
}

function actionTabPayments() {
  this.parentNode.dataset.selectedTab = '2';
  requestTabPayments();
}

function requestTabCourse() {
  request(urlCourse, 'multiple', (parser, response) => {
    modifyDOMCourse(parser.parseFromString(response.data, "text/html"), res => {
      requestDone(res);
    });
  });
}

function requestTabPayments() {
  request(urlPayments, 'individual', (parser, response) => {
    modifyDOMPayments(parser.parseFromString(response.data, "text/html"), res => {
      requestDone(res);
    });
  });
}

function request(url, type, fn) {
  loading.style.display = "block";
  contentAll.style.display = "none";

  const getType = type === 'multiple' ? getMultiple(url) : get(url);

  getType
    .then(response => {
      const parser = new DOMParser();
      fn(parser, response);
    })
    .catch(errorMessage => {
      actionClose();
    });
}

function requestDone(res) {
  loading.style.display = "none";

  if(res) {
    contentAll.style.display = "block";
  } else {
    let contentNotLogged = findId('content-not-logged');
    contentNotLogged.style.display = "block";
  }
}
