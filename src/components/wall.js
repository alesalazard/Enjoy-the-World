import { onNavigate } from '../main.js';
import {
  createPosts,
  signOff,
  onGetPosts,
  deletePosts,
  editPosts,
  updatePosts,
  addLikes,
  removeLikes,
  onAuthStateChanged,
  auth,
} from '../firebase/connection.js';

export const wall = () => {
  const containerWall = document.createElement('section'); // Main container
  containerWall.class = 'container';
  containerWall.id = 'containerWall';

  // HEADER CONTAINER
  const header = document.createElement('header');
  header.classList.add('header');

  const imgTitle = document.createElement('img'); // Title image or logo
  imgTitle.src = 'img/nameLogo.png';
  imgTitle.alt = 'Logo';
  imgTitle.id = 'imgTitle';

  const profileName = document.createElement('h2');
  profileName.id = 'user-name';

  const title = document.createElement('h1'); // Title
  title.textContent = '¿Qué festividad estás celebrando?';
  title.id = 'titleWall';

  const buttonExit = document.createElement('button'); // Buton icon exit
  buttonExit.classList.add('buttonIcons');
  buttonExit.id = 'btnExit';

  // CONTENEDOR DEL MAIN DE LA PAGINA
  const mainWall = document.createElement('section');
  mainWall.className = 'main-wall';

  // TEXTAREA AND SEND ICON CONTAINER
  const wallFormContainer = document.createElement('article');
  wallFormContainer.classList.add('wallForm');

  const wallPost = document.createElement('textarea'); // Textarea
  wallPost.classList.add('post');
  wallPost.setAttribute('type', 'text');
  wallPost.setAttribute('id', 'postWall');
  wallPost.setAttribute('rows', '4');
  wallPost.setAttribute('placeholder', ' Tu post aquí');

  const iconContainer = document.createElement('article'); // container for send icon
  iconContainer.setAttribute('id', 'send-container');

  const buttonSend = document.createElement('button'); // send button icon
  buttonSend.classList.add('buttonIcons');
  buttonSend.id = 'btnSend';

  const postZoneContainer = document.createElement('article'); // container for the post print
  postZoneContainer.setAttribute('id', 'postZoneContainer');

  let editStatus = false;
  let idPost = '';
  const userLikes = [];

  onGetPosts((querySnapshot) => {
    postZoneContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
      // crea un elemento p donde quedará el post
      const postBox = document.createElement('p'); // here lives the post after print
      postBox.className = 'textPost';
      postBox.textContent = doc.data().post;

      // boton de dar like al post
      const buttonHeart = document.createElement('button');
      buttonHeart.setAttribute('data-id', doc.id);
      buttonHeart.setAttribute('data-id', window.user.uid);
      buttonHeart.classList.add('buttonIcons');
      buttonHeart.id = 'btnHeart';

      const counterLikes = document.createElement('span');
      counterLikes.id = 'counter';
      counterLikes.setAttribute('data-likes', 2);
      counterLikes.textContent = doc.data().likes.length;

      // boton de editar el post
      const buttonEdit = document.createElement('button');
      buttonEdit.setAttribute('data-id', doc.id);
      buttonEdit.classList.add('buttonIcons');
      buttonEdit.id = 'btnEdit';

      // boton de eliminar post
      const buttonTrash = document.createElement('button');
      buttonTrash.setAttribute('data-id', doc.id);
      buttonTrash.classList.add('buttonIcons');
      buttonTrash.id = 'btnTrash';

      // se pinta el post junto botones de eliminar, editar, like
      postZoneContainer.append(postBox, buttonHeart, counterLikes, buttonEdit, buttonTrash);

      // Click para editar
      buttonEdit.addEventListener('click', async (e) => {
        const docId = await editPosts(e.target.dataset.id);
        const postText = docId.data();
        idPost = doc.id;
        wallPost.value = postText.post;

        editStatus = true;
      });

      // Click para eliminar
      buttonTrash.addEventListener('click', ({ target: { dataset } }) => {
        deletePosts(dataset.id);
      });

      // Click para dar like
      buttonHeart.addEventListener('click', () => {
        const arrayLikes = doc.data().likes;
        if (!arrayLikes.includes(window.user.uid)) {
          addLikes(doc.id, window.user.uid);
        } else {
          removeLikes(doc.id, window.user.uid);
        }
      });
    });
  });

  // Click para cerrar sesión
  buttonExit.addEventListener('click', () => {
    signOff().then(() => {
      onNavigate('/');
    }).catch(() => {
    });
  });

  // Click para enviar el post al crearlo o al editarlo
  buttonSend.addEventListener('click', () => {
    const post = wallPost.value;

    wallPost.value = '';

    if (!editStatus) {
      createPosts(post, userLikes);
    } else {
      updatePosts(idPost, { post });
      editStatus = false;
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      profileName.textContent = user.displayName;
    }
  });

  containerWall.append(header, mainWall);
  header.append(imgTitle, title, buttonExit);
  mainWall.append(profileName, wallFormContainer, postZoneContainer);
  wallFormContainer.append(wallPost, iconContainer);
  iconContainer.append(buttonSend);

  return containerWall;
};
