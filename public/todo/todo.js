'use strict';
class TodoApi {
  constructor(base = '/api/v1/todos') { this.base = base; }
  async request(path, method, body) {
    const res = await fetch(this.base + path, { method, ...(body ? {
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    } : {}) });
    if (res.status === 204) return;
    const json = await res.json();
    if (!res.ok) throw new Error(json.code + '：' + json.message);
    return json.data;
  }
  list() { return this.request('', 'GET'); }
  create(title) { return this.request('', 'POST', { title }); }
  update(id, isCompleted) { return this.request('/' + id, 'PATCH', { isCompleted }); }
  delete(id) { return this.request('/' + id, 'DELETE'); }
}

const api = new TodoApi();
const form = document.querySelector('#new-todo'), input = document.querySelector('#title');
const list = document.querySelector('#tasks'), empty = document.querySelector('#empty'), notice = document.querySelector('#notice');
let busy = false;
function render(rows) {
  list.replaceChildren();
  empty.hidden = rows.length !== 0;
  for (const row of rows) {
    const li = document.createElement('li'), label = document.createElement('label');
    const check = document.createElement('input'), title = document.createElement('span'), del = document.createElement('button');
    check.type = 'checkbox'; check.checked = row.isCompleted; title.textContent = row.title;
    check.addEventListener('change', () => {
      const next = check.checked; check.checked = row.isCompleted;
      run(() => api.update(row.id, next));
    });
    del.textContent = '削除'; del.type = 'button'; del.setAttribute('aria-label', row.title + 'を削除');
    del.addEventListener('click', () => run(() => api.delete(row.id)));
    label.append(check, title); li.append(label, del); list.append(li);
  }
}
async function run(action) {
  if (busy) return;
  busy = true; empty.hidden = true; notice.textContent = '通信中…';
  const controls = document.querySelectorAll('main input, main button');
  controls.forEach(el => { el.disabled = true; });
  try {
    if (action) await action();
    render(await api.list()); notice.textContent = '';
  } catch (err) {
    notice.textContent = '操作結果を確認できません。一覧を再取得してください。' + (err.message || '');
  } finally {
    controls.forEach(el => { el.disabled = false; }); busy = false;
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title || [...title].length > 100) { notice.textContent = 'タイトルは1〜100文字で入力してください'; return; }
  run(async () => { await api.create(title); input.value = ''; });
});
document.querySelector('#reload').addEventListener('click', () => run());
run();
