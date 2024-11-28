const User = require('../models/User')

class LibraryWord {
    constructor(word) {
        this.word = word
        this.sentences = []
        this.repetitionIteration = 0
        this.lastRepeated = new Date(Date.now())
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

exports.getWords = async (req, res) => {
    const words = (await User.findById(req.user.id).select('library -_id')).library 
    
    if (words.length === 0) { // could change to randomly advised words
        throw new Error("Your library is empty!")
    }

    // sort words in order of priority
    words.sort((a, b) => {
        // first, sort by the date
        const aDate = a.lastRepeated.toISOString().split('T')[0]
        const bDate = b.lastRepeated.toISOString().split('T')[0]
        console.log(aDate, bDate)
        if (aDate !== bDate) {
            return aDate.localeCompare(bDate)
        }
        // if dates are the same, then prioritize those words that were repeated the least amount of tmes
        return a.repetitionIteration > b.repetitionIteration ? 1 : -1
    })
    // What about adding tags to prioritize sorting by a topic (for each individual some topics are more imporant than others)?

    res.status(200).json({
        status: "success",
        words: words
    })
}