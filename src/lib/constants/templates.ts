import { WorkoutSplitTemplate } from "@/lib/types";

export const WORKOUT_TEMPLATES: WorkoutSplitTemplate[] = [
  {
    name: "3-Day Full Body",
    daysPerWeek: 3,
    days: [
      {
        day: 1,
        exercises: [
          { name: "Squat", sets: 4, reps: 8 },
          { name: "Bench Press", sets: 4, reps: 8 },
          { name: "Barbell Row", sets: 4, reps: 10 },
          { name: "Overhead Press", sets: 3, reps: 8 },
          { name: "Pull-ups", sets: 3, reps: 8 }
        ]
      },
      {
        day: 2,
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5 },
          { name: "Incline Dumbbell Press", sets: 4, reps: 10 },
          { name: "Lat Pulldown", sets: 4, reps: 10 },
          { name: "Dumbbell Shoulder Press", sets: 3, reps: 10 },
          { name: "Dips", sets: 3, reps: 8 }
        ]
      },
      {
        day: 3,
        exercises: [
          { name: "Leg Press", sets: 4, reps: 12 },
          { name: "Dumbbell Bench Press", sets: 4, reps: 10 },
          { name: "Seated Row", sets: 4, reps: 10 },
          { name: "Lateral Raise", sets: 3, reps: 12 },
          { name: "Planks", sets: 3, reps: 60 }
        ]
      }
    ]
  },
  {
    name: "4-Day Upper/Lower",
    daysPerWeek: 4,
    days: [
      {
        day: 1, // Upper A
        exercises: [
          { name: "Bench Press", sets: 4, reps: 6 },
          { name: "Barbell Row", sets: 4, reps: 8 },
          { name: "Overhead Press", sets: 3, reps: 8 },
          { name: "Pull-ups", sets: 3, reps: 8 },
          { name: "Dips", sets: 3, reps: 10 },
          { name: "Barbell Curl", sets: 3, reps: 10 }
        ]
      },
      {
        day: 2, // Lower A
        exercises: [
          { name: "Squat", sets: 4, reps: 6 },
          { name: "Romanian Deadlift", sets: 3, reps: 8 },
          { name: "Leg Press", sets: 3, reps: 12 },
          { name: "Leg Curl", sets: 3, reps: 12 },
          { name: "Calf Raise", sets: 4, reps: 15 }
        ]
      },
      {
        day: 3, // Upper B
        exercises: [
          { name: "Incline Bench Press", sets: 4, reps: 8 },
          { name: "Lat Pulldown", sets: 4, reps: 10 },
          { name: "Dumbbell Shoulder Press", sets: 3, reps: 10 },
          { name: "Face Pull", sets: 3, reps: 12 },
          { name: "Close-Grip Bench Press", sets: 3, reps: 10 },
          { name: "Hammer Curl", sets: 3, reps: 12 }
        ]
      },
      {
        day: 4, // Lower B
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5 },
          { name: "Bulgarian Split Squat", sets: 3, reps: 10 },
          { name: "Leg Extension", sets: 3, reps: 12 },
          { name: "Leg Curl", sets: 3, reps: 12 },
          { name: "Walking Lunges", sets: 3, reps: 12 }
        ]
      }
    ]
  },
  {
    name: "5-Day Push/Pull/Legs",
    daysPerWeek: 5,
    days: [
      {
        day: 1, // Push
        exercises: [
          { name: "Bench Press", sets: 4, reps: 6 },
          { name: "Overhead Press", sets: 3, reps: 8 },
          { name: "Incline Dumbbell Press", sets: 3, reps: 10 },
          { name: "Dips", sets: 3, reps: 10 },
          { name: "Lateral Raise", sets: 3, reps: 12 },
          { name: "Triceps Pushdown", sets: 3, reps: 12 }
        ]
      },
      {
        day: 2, // Pull
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5 },
          { name: "Barbell Row", sets: 4, reps: 8 },
          { name: "Pull-ups", sets: 3, reps: 8 },
          { name: "Lat Pulldown", sets: 3, reps: 10 },
          { name: "Face Pull", sets: 3, reps: 12 },
          { name: "Barbell Curl", sets: 3, reps: 10 }
        ]
      },
      {
        day: 3, // Legs
        exercises: [
          { name: "Squat", sets: 4, reps: 6 },
          { name: "Romanian Deadlift", sets: 3, reps: 8 },
          { name: "Leg Press", sets: 3, reps: 12 },
          { name: "Leg Curl", sets: 3, reps: 12 },
          { name: "Calf Raise", sets: 4, reps: 15 }
        ]
      },
      {
        day: 4, // Push 2
        exercises: [
          { name: "Incline Bench Press", sets: 4, reps: 8 },
          { name: "Dumbbell Shoulder Press", sets: 3, reps: 10 },
          { name: "Decline Bench Press", sets: 3, reps: 10 },
          { name: "Lateral Raise", sets: 3, reps: 15 },
          { name: "Overhead Triceps Extension", sets: 3, reps: 12 }
        ]
      },
      {
        day: 5, // Pull 2
        exercises: [
          { name: "Seated Row", sets: 4, reps: 10 },
          { name: "T-Bar Row", sets: 3, reps: 10 },
          { name: "Lat Pulldown", sets: 3, reps: 12 },
          { name: "Shrugs", sets: 3, reps: 12 },
          { name: "Hammer Curl", sets: 3, reps: 12 }
        ]
      }
    ]
  }
];