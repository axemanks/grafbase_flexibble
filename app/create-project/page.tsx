// create-project
import { redirect } from "next/navigation";
import Modal from "@/components/Modal"
import ProjectForm from "@/components/ProjectForm"
import async from '../../components/Navbar';
import { getCurrentUser } from "@/lib/session";

// this will be a modal

const CreateProject = async () => {
    // get session
    const session = await getCurrentUser()
    if(!session?.user) redirect('/');
  
    return (
    <Modal>
        <h3 className="modal-head-text">Create a New Project</h3>
        <ProjectForm type="create" session={session} />
    </Modal>
  )
}

export default CreateProject