const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess)
    {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;      // mendapatkan id dari request.params
    const note = notes.filter((n) => n.id === id)[0];   // mendapatkan objek note dari objek array notes
    
    // mengembalikan fungsi handler dengan data beserta objek note
    if (note !== undefined)     // cek apakah objek note bernilai undefined atau tidak
    {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({       // jika objek note bernilai undefined, kembalikan pesan gagal
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) =>
{
    const { id } = request.params;      // mendapatkan id notes dari request.params

    const {title, tags, body} = request.payload;    // mendapatkan data notes terbaru yang dikirimkan oleh client melalui body request
    const updatedAt = new Date().toISOString();     // memperbarui properti updatedAt
    
    // mengubah catatan lama dengan catatan yg baru menggunakan index dari array
    const index = notes.findIndex((note) => note.id === id); // dapatkan dulu index array dari notes sesuai id yg ditentukan

    if(index !== -1)    // cek apakah note dengan id yg dicari ditemukan
    {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    // response jika note tidak ditemukan (index bernilai -1)
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) =>
{
    const {id} = request.params;
    
    const index = notes.findIndex((note) => note.id === id);
    if (index !== -1)   // pastikan index tidak bernilai -1
    {
        notes.splice(index, 1);     // untuk menghapus data pada array berdasarkan index
        const response = (h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        }));
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };