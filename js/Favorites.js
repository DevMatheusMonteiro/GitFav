import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.key = "@github-favorites:";
    this.load();
  }

  load() {
    this.data = JSON.parse(localStorage.getItem(this.key)) || [];
  }

  async add(userLogin) {
    try {
      const githubuser = await GithubUser.search(userLogin);
      const userExists = this.data.find(
        (user) => user.login.toUpperCase() == userLogin.toUpperCase()
      );
      if (userExists) {
        throw new Error("Usuário já existe");
      }

      if (githubuser.login == undefined) {
        throw new Error("Informe um usuário válido");
      }

      this.data = [githubuser, ...this.data];
      this.update();
      this.save();
      return githubuser;
    } catch (error) {
      alert(error);
    }
  }

  delete(userLogin) {
    const filteredUser = this.data.filter((user) => user.login != userLogin);

    this.data = filteredUser;
    this.update();
    this.save();
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.data));
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.onAdd();
    this.update();
  }

  onAdd() {
    const buttonAdd = this.root.querySelector("#add");
    const inputSearch = this.root.querySelector("#input-search");
    buttonAdd.addEventListener("click", (e) => {
      e.preventDefault();
      const { value } = inputSearch;
      this.add(value).then((test) => {
        if (test != undefined) {
          inputSearch.value = "";
        }
      });
    });
  }

  update() {
    this.removeAllTr();

    if (this.data.length == 0) {
      this.row = this.createEmptyRow();
      this.tbody.append(this.row);
    } else {
      this.tbody.querySelectorAll("tr").forEach((tr) => {
        if (tr.classList.contains("emptyRow")) {
          tr.remove();
        }
      });
    }

    this.data.forEach((user) => {
      this.row = this.createFullRow();
      const userProfile = this.row.querySelector(".userProfile");
      const img = userProfile.querySelector("img");
      const profileLink = userProfile.querySelector("a");
      const username = profileLink.querySelector("a p");
      const login = profileLink.querySelector("a span");
      const userRepositories = this.row.querySelector(".userRepositories");
      const userFollowers = this.row.querySelector(".userFollowers");
      const remove = this.row.querySelector(".remove");

      img.src = `https://github.com/${user.login}.png`;
      img.alt = `Imagem de ${user.name}`;

      profileLink.href = `https://github.com/${user.login}`;
      username.textContent = user.name;
      login.textContent = user.login;

      userRepositories.textContent = user.public_repos;
      userFollowers.textContent = user.followers;

      remove.addEventListener("click", () => {
        const isOk = confirm(`Tem certeza que deseja excluir ${user.login}?`);

        if (isOk) {
          this.delete(user.login);
        }
      });

      this.tbody.append(this.row);
    });
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr.fullRow").forEach((tr) => {
      tr.remove();
    });
  }

  createFullRow() {
    const tr = document.createElement("tr");

    tr.classList.remove("emptyRow");
    tr.classList.add("fullRow");
    tr.innerHTML = `
            <td class="userProfile">
                <img
                src="https://github.com/DevMatheusMonteiro.png"
                alt="Imagem de Matheus Monteiro"
                />
                <a href="https://github.com/DevMatheusMonteiro" target="_blank">
                <p>Matheus Monteiro</p>
                <span>DevMatheusMonteiro</span>
                </a>
            </td>
            <td class="userRepositories">123</td>
            <td class="userFollowers">123</td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `;
    return tr;
  }

  createEmptyRow() {
    const tr = document.createElement("tr");
    tr.classList.remove("fullRow");
    tr.classList.add("emptyRow");
    tr.innerHTML = `
        <tr class="emptyRow">
            <td>
              <img
                src="./images/emptyStar.svg"
                alt="Estrela com rosto surpreso"
              />
              <p>Nenhum favorito ainda</p>
            </td>
        </tr>
    `;

    return tr;
  }
}
