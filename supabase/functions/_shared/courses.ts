export type CourseDefinition = {
  id: string
  name: string
  amount: number
  currency: string
  driveLink: string
}

const catalog: CourseDefinition[] = [
  {
    id: 'cpa-mastery',
    name: 'CPA MASTERY',
    amount: 239900,
    currency: 'INR',
    driveLink:
      Deno.env.get('CPA_MASTERY_DRIVE_URL') ||
      'https://drive.google.com/drive/folders/1FYD-fUr22h8gsHdiWbLPLLZNQMxvlx-9',
  },
]

export function getCourse(courseId: string) {
  return catalog.find((course) => course.id === courseId)
}
