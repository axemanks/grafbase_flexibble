"use client"
import { SessionInterface } from '@/common.types'
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import FormField from './FormField';
import { useRouter } from 'next/navigation';
import { categoryFilters }from '@/constants/index'
import CustomMenu from './CustomMenu';
import Button from './Button';
import { createNewProject, fetchToken } from '@/lib/actions';


type Props = {
    type: string,
    session: SessionInterface,
}

const ProjectForm = ({ type, session }: Props) => {
    const router = useRouter();
    // handleFormSubmit
    const handleFormSubmit =  async (e: React.FormEvent) => {
        e.preventDefault();
        // set isSubmitting to true
        setIsSubmitting(true);
        // get the session token
        const { token } = await fetchToken();

        try {
            if(type === 'create') {
                // create project
                await createNewProject(form, session?.user?.id, token);
                // navigate to the project page
                router.push('/')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    // hadle the image change
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault(); // prevent the page from refreshing
        // get the image from the input and set to file
        const file = e.target.files?.[0];
        // check the file
        if(!file) return; // no file
        // if not an image
        if(!file.type.includes('image')){
            return alert('Please upload an image file');
        } 
        // init the reader
        const reader = new FileReader();
        // pass the file to the reader
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange('image', result);
        }


    };
    const handleStateChange = (fieldName: string, value: string) => {
        setform((prevState) => 
        ({ ...prevState, [fieldName]: value }));
    };


    // useState - for form data
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setform] = useState({
        title: '',
        description: '',
        liveSiteUrl: '',
        githubUrl: '',
        category: '',
        image: '',
    })



  return (
    <form onSubmit={handleFormSubmit} className='flexStart form'>
        {/* File upload */}
        <div className='flexStart form_image-container'>
            <label htmlFor="poster" className='flexCenter form_image-label'>
                {!form.image && 'Choose a poster for your project'}
            </label>
            <input 
            type="file" 
            id='image' 
            accept='image/*' 
            required={type === 'create' ? true : false} 
            className='form_image-input' 
            onChange={handleChangeImage}
            />
            {form.image && (
                <Image 
                src={form?.image} 
                className='sm:p-10 object-contain z-20'
                alt='project-poster' 
                fill
                />
            )}
        </div>
        {/* form fields */}
        {/* Title */}
        <FormField 
        title="Title"
        state={form.title}
        placeholder="Flexibble"
        setState={(value) => handleStateChange('title', value)}
        
        />
        {/* Description */}
        <FormField 
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects."
        setState={(value) => handleStateChange('description', value)}
        
        />
        {/* Website URL */}
        <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://jsmastery.pro"
        setState={(value) => handleStateChange('liveSiteUrl', value)}        
        />
        {/* Github */}
        <FormField
        type='url' 
        title="Github URL"
        state={form.githubUrl}
        placeholder="https://github.com/axemanks/"
        setState={(value) => handleStateChange('githubUrl', value)}
        
        />


        {/* Custom Drop Down */}
        <CustomMenu 
            title="Category"
            state={form.category}
            filters={categoryFilters}
            setState={(value) => handleStateChange('category', value)}

        />

        {/* button */}
        <div className='flexStart w-full'>
            <Button 
            title={
                isSubmitting 
                ? `${type === 'create' ? 'Creating' : 'Editing'}`
                : `${type === 'create' ? 'Create' : 'Edit'}`
            }
            type="submit" 
            leftIcon={isSubmitting ? '' : '/plus.svg'} 
            isSubmitting={isSubmitting} />
        </div>
    </form>
  )
}

export default ProjectForm