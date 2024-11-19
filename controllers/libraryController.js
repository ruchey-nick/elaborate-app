const User = require('../models/User')

class LibraryWord {
    constructor(word) {
        this.word = word
        this.sentences = []
        this.repetitionIteration = 0
        this.lastRepeated = Date.now()
    }
} 

exports.addWord = async (req, res) => {
    const word = req.body.word
    
    const currentUser = await User.findById(req.user.id)
    currentUser.library.push(new LibraryWord(word))
    await currentUser.save()

    res.status(200).json({
        status: "success",
        library: currentUser.library,
    })
}