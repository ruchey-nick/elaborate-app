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

exports.getWord = async (req, res) => {
    const words = (await User.findById(req.user.id).select('library -_id')).library 
    
    if (words.length === 0) { // could change to randomly advised words
        throw new Error("Your library is empty!")
    }

    // sort words in order of priority!
    // 1. By due !date! (look at the lastRepeated and repetitionIteration (each iteration has its own time period))
    // 2. Within the time priority, sort words so that those that have the least repetitionIteration are in the front

    res.status(200).json({
        status: "success",
        words: words
    })
}