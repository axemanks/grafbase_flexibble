// basic endpoint for nextjs 13.4+
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// setup cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
});

// POST
export async function POST(request: Request){
    const { path } = await request.json();

    if(!path) {
        return NextResponse.json( 
            {message: 'Image path is required'}, 
            { status: 400 } 
        )
    }

    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [{ with: 1000, height: 752, crop: "scale"}]
        }

        const result = await cloudinary.uploader.upload(path, options);

        return NextResponse.json(result, { status: 200 });

    } catch (err) {
        return NextResponse.json( 
            {message: 'Error uploading image'},
            { status: 400 } 
        )
    }
}