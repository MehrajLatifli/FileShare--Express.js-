
import mongoose, { Schema } from 'mongoose';
import { randomUUID } from 'crypto';

const UserSchema = new Schema({
  id: { type: Schema.Types.UUID, unique: true, default: () => randomUUID() },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (email) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    
  }
}, {
  virtuals: {
    domain: {
      get() { return this.email.includes('gmail') ? 'Gmail account' : 'External Domain'; }
    }
  },
  toJSON: {
    virtuals: true
  }
});


const FileSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  filename: {
    type: String,
    minlength: 1,
    maxlength: 200,
    required: true
  },
  filesize: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const maxSizeInBytes = 10 * 1024 * 1024; 
        return value <= maxSizeInBytes;
      },
      message: 'File size exceeds the maximum limit of 10 MB'
    }
  },
  filetype: {
    type: String,
    required: true,
    enum: {
      values: ['jpeg','jpg', 'png', 'gif', 'pdf','mp3',"mp4",'zip'],
      message: props => `${props.value} is not a valid filetype`
    }
  },
  filepath: {
    type:  [String],
    required: true,
    
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});



export const User = mongoose.model('User', UserSchema, 'User');
export const File = mongoose.model('File', FileSchema, 'File');