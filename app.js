//variables
const loader = document.querySelector('#loader');

document.querySelector('#userTable').addEventListener('click',(e)=>{
   if(e.target.parentElement.classList.contains('selected'))
   {
        e.target.parentElement.classList.toggle('has-background-warning');
   }

   if(e.target.classList.contains('deleted'))
   {
        if(confirm('¿Quieres eliminar este usuario?'))
        {   
            UI.deleteUser(e.target.parentElement.parentElement);
            UI.showMessage('Elemento eliminado con éxito.','has-background-success has-text-white');
        }
   }
});

document.querySelector('#addUserForm').addEventListener('submit', (e)=>
{
    e.preventDefault();
   const id = Math.floor(Math.random() * 150) + 50;
   const name = document.querySelector('#name').value;
   const userName = document.querySelector('#userName').value;
   const email = document.querySelector('#email').value;

   //if fields is empty
    if(name =='' || userName=='' || email=='')
    {
        UI.showMessage('Debes llenar todos los campos.','has-background-warning');
    }
    else
    {
        const row = 
        `
            <tr class="selected">
                <td class="has-text-centered">${id}</td>
                <td class="has-text-centered">${name}</td>
                <td class="has-text-centered">${userName}</td>
                <td class="has-text-centered">${email}</td>
                <td class="has-text-centered">
                    <a href="#" class="button is-danger deleted">X</a>
                </td>    
            </tr>
        `;
        UI.addUser(row);
        UI.clearFields();
        UI.showMessage('Se agregó un nuevo usuario.','has-background-info has-text-white');
    }
});

document.querySelector('#getUsers').addEventListener('click',()=>{
    const req = new XMLHttpRequest();
    req.open('GET','https://jsonplaceholder.typicode.com/users');
    req.send();
    loader.classList.add('loader');
    req.onreadystatechange = ()=>
    {
        if(req.readyState==4 && req.status==200)
        {
          loader.classList.remove('loader');
        }
    };

    req.onload =()=>
    {
        const usersTable = addToRow(JSON.parse(req.responseText));
        UI.addUser(usersTable);
        UI.showMessage('Nuevos usuarios agregados.', 'has-background-link has-text-white');
    }
});
class UI
{
    static showMessage(message, classStyle)
    {
        const div = document.createElement('div');
        div.classList = classStyle + ' info p-2';
        div.appendChild(document.createTextNode(message));
    
        const container = document.querySelector('body');
        container.appendChild(div);
        setTimeout(()=>{ document.querySelector('.info').remove(); }, 3000);
    }

    static deleteUser(element)
    {
        element.remove();
    }

    static addUser(row)
    {
        document.querySelector('#userTable').innerHTML += row;
    }

    static clearFields()
    {
        document.querySelector('#name').value     = '';
        document.querySelector('#userName').value = '';
        document.querySelector('#email').value    = '';
    }
}

const addToRow=(usersJson)=>
{
    let users ='';
    usersJson.forEach((user)=>{
        users +=
        `
            <tr class="selected">
                <td class="has-text-centered">${user.id}</td>
                <td class="has-text-centered">${user.name}</td>
                <td class="has-text-centered">${user.username}</td>
                <td class="has-text-centered">${user.email}</td>
                <td class="has-text-centered">
                    <a href="#" class="button is-danger deleted">X</a>
                </td>    
            </tr>
        `;
    });
    return users;
};
