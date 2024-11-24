import { githubUser } from "./githubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try{
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await githubUser.search(username)
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } 
    catch(e) {
      alert(e.message)
    }
    
    
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => 
      entry.login !== user.login)

      this.entries = filteredEntries
      this.update()
      this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".create-fav .favorite-button button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.create-fav .input input')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr();
  
    if (this.entries.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="4" class="empty-message">
          <div class="flex-container">
            <img src="./assets/Estrela.svg"></img> 
            <p>Nenhum favorito ainda</p>
          </div>  
        </td>
      `;
      this.tbody.append(emptyRow);
    } else {
      this.entries.forEach(user => {
        const row = this.createRow();
  
        row.querySelector('.user a img').src = `https://github.com/${user.login}.png`;
        row.querySelector('.user a img').alt = `Imagem de ${user.login}`;
        row.querySelector('.user a').href = `https://github.com/${user.login}`;
        row.querySelector('.user .namespace p').textContent = user.name;
        row.querySelector('.user .namespace span').textContent = user.login;
        row.querySelector('.repositories').textContent = user.public_repos;
        row.querySelector('.followers').textContent = user.followers;
  
        row.querySelector('.remove').onclick = () => {
          const confirmeIfDelete = confirm('Tem certeza que deseja deletar esta linha?');
          if (confirmeIfDelete) {
            this.delete(user);
          }
        };
  
        this.tbody.append(row);
      });
    }
  }
  

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML =  
        `<td class="user">
            <a href="https://github.com/LuizZampier">
              <img src="https://github.com/LuizZampier.png" alt="Foto do usuário">
              <div class="namespace">
                <p>Luiz Zampier</p>
                <span>/LuizZampier</span>
              </div>
            </a>
          </td>
          <td class="repositories">
            123
          </td>
          <td class="followers">
            1234
          </td>
          <td class="remove">
            <button>
                Remover
            </button>
          </td> `

    return tr  
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}