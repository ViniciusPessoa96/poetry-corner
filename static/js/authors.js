
const authorsIds = ['authors_a', 'authors_b', 'authors_c', 'authors_d', 'authors_e', 'authors_f', 
'authors_g', 'authors_h', 'authors_i', 'authors_j', 'authors_k', 'authors_l', 'authors_m', 
'authors_n', 'authors_o', 'authors_p', 'authors_q', 'authors_r', 'authors_s', 'authors_t', 
'authors_u', 'authors_v', 'authors_w', 'authors_x', 'authors_y', 'authors_z']

function showAuthorsWithGivenLetter(authors){
    const authorsDiv = document.getElementsByClassName('authors')[0];
    const authorsDivChild = authorsDiv.children[0]

    console.log(authorsDivChild)

    const authorsList = document.createElement('ul');

    for (let author of authors){

        let htmlString = `<li><a href='http://localhost:5002/poetry_from/${author}'>${author}</a></li>`
        htmlString = htmlString.trim()

        let tmpltElement = document.createElement('template')
        tmpltElement.innerHTML = htmlString
        authorsList.append(tmpltElement.content.firstChild)
    }

    authorsDivChild.append(authorsList)
}

function clearAuthors() {
    const authorsDiv = document.getElementsByClassName('authors')[0];
    const authorsDivChild = authorsDiv.children[0]
    const authorsList = authorsDivChild.children[2]
    authorsList.remove()
}

function authorsWithLetter(letter){
    //console.log(authorId)
    //let letter = authorId.slice(8);
    localStorage.setItem('author_key', letter);
    fetch(`http://localhost:5002/authors_with/${letter}`)
    .then(res => {
        console.log(res)
        res = res.json()
        res.then(data => {
            //do something with the data
            console.log(data)
            showAuthorsWithGivenLetter(data)
        })
    })
    .catch(e => {
        console.log(e)
    })
}

for (let authorId of authorsIds) {
    let authorLink = document.getElementById(authorId);
    authorLink.addEventListener('click', () => {
        clearAuthors()
        let letter = authorId.slice(8)
        authorsWithLetter(letter)
    })
}


window.onload = () => {
    localStorage.setItem('author_key', 'A');
    authorsWithLetter('a')
}

console.log(localStorage.getItem('author_key'))

