const nav = document.querySelector('.nav');

const navItems = [...nav.children]


const render = (path) => {
  // const content = document.querySelector('.content');
  // content.innerHTML = path;
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const path = item.textContent;
    history.pushState({ path }, null, path);
    render(path);
  })
})
