class Note {
    constructor(id, labelIds, content, updateAt, isBookmarked) {
      this.id = id;
      this.labelIds = labelIds;
      this.content = content;
      this.updateAt = updateAt;
      this.isBookmarked = isBookmarked;
    }
  }
  
  export default Note;
  