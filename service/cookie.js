const session  = new Map()

function setuser(id,user){
    session.set(id,user)

}

function getuser(id){
    return session.get(id)
}

module.exports = {
    getuser,
    setuser
}