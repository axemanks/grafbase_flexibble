// edit project
import { redirect } from "next/navigation";

import Modal from "@/components/Modal";
import ProjectForm from "@/components/ProjectForm";
import { getCurrentUser } from "@/lib/session";
import { getProjectDetails } from "@/lib/actions";
import { ProjectInterface } from "@/common.types";

const EditProject = async ({ params: { id } }: { params: { id: string } }) => {
  // get the user
  const session = await getCurrentUser();
  // check if the user is the one the authored
  if (!session?.user) redirect("/")
  // get details by id
  const result = await getProjectDetails(id) as { project?: ProjectInterface };
  // check
  if (!result?.project) return (
    <p className="no-result-text">Failed to fetch project info</p>
  )

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>

      <ProjectForm type="edit" session={session} project={result?.project} />
    </Modal>
  );
};

export default EditProject;
