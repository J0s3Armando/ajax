//variables
const loader = document.querySelector('#loader');
const table = document.querySelector('#userTable');
const tablePlaceholder = document.querySelector('#tablePlaceholder');

table.addEventListener('click',(e)=>{
   if(e.target.parentElement.classList.contains('selected'))
   {
        e.target.parentElement.classList.toggle('has-background-warning');
   }

   if(e.target.classList.contains('deleted'))
   {
        Swal.fire(
            {
                title:'Eliminar usuario',
                text:'¿Deseas eliminar el siguiente usuario?',
                icon:'warning',
                confirmButtonText:'Eliminar',
                confirmButtonColor:'#ec7063',
                showCancelButton:true,
                cancelButtonColor:'#5a5a5a'
            }).then((result)=>
            {
                if(result.isConfirmed)
                {
                    //remove table row 
                    UI.deleteUser(e.target.parentElement.parentElement);
                    Swal.fire
                    (
                        {
                            title:'Usuario eliminado',
                            text:'La tabla se ha actualizado correctamente.',
                            icon:'success',
                            confirmButtonText:'Listo!',
                            timer:3000
                        }
                    );
                }
            });
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
        const row = document.createElement('tr');
        row.classList = 'selected animate__animated animate__slideInUp';
        row.innerHTML=
        `
            <td class="has-text-centered">${id}</td>
            <td class="has-text-centered">${name}</td>
            <td class="has-text-centered">${userName}</td>
            <td class="has-text-centered">${email}</td>
            <td class="has-text-centered">
            <a href="#" class="button is-danger deleted">X</a>
            </td> 
        `;
        setTimeout(()=>{
            row.classList.remove('animated__slideInUp');
        },3000);

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
        table.innerHTML='';
        addToRow(JSON.parse(req.responseText));
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
        element.classList.add('animate__fadeOut');
        setTimeout(()=>
      {
        element.remove();
        if(table.rows.length==0)
        {
              table.innerHTML=
             `
                 <tr id="tablePlaceholder">
                     <td colspan="5" class="has-text-centered title is-4 has-text-grey">No hay datos.</td>
                 </tr>
             `;
        }
      },1000);
    }

    static addUser(row)
    {
        if(document.querySelector('#tablePlaceholder'))
        {
            document.querySelector('#tablePlaceholder').remove();
        }
        document.querySelector('#userTable').appendChild(row);
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
    usersJson.forEach((user)=>
    {
        const tableRow = document.createElement('tr');
        tableRow.classList = 'selected animate__animated animate__slideInUp';
        tableRow.innerHTML=
        `
            <td class="has-text-centered">${user.id}</td>
            <td class="has-text-centered">${user.name}</td>
            <td class="has-text-centered">${user.username}</td>
            <td class="has-text-centered">${user.email}</td>
            <td class="has-text-centered">
                <a href="#" class="button is-danger deleted">X</a>
            </td>  
        `;
        setTimeout(()=>{ tableRow.classList.remove('animate__slideInUp'); },3000);
        UI.addUser(tableRow);
    });
    return users;
}

window.onload=()=>
{
    table.innerHTML=
    `
         <tr id="tablePlaceholder">
            <td colspan="5" class="has-text-centered title is-4 has-text-grey">No hay datos.</td>
        </tr>
    `;
};