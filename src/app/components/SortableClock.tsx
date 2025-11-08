// SortableClock.tsx (≈ 20 lines)
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableClock({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className='rounded-xl border p-3'>
      <button
        className='mr-2 cursor-grab select-none'
        aria-label='Drag to reorder'
        {...attributes}
        {...listeners}
      >
        ☰
      </button>
      {children}
    </div>
  );
}
