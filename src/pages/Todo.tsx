import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Bell } from 'lucide-react';
import { Toaster, toast } from 'sonner';

type Todo = Tables<'todo_lists'>;

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This is a placeholder for the actual user ID from an auth context
  const userId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';

  useEffect(() => {
    const fetchTodos = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('todo_lists')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setTodos(data);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [userId]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '' || !userId) return;

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('todo_lists')
        .insert({
          user_id: userId,
          task: newTask.trim(),
          completed: false,
        })
        .select();

      if (error) throw error;

      if (data) {
        setTodos([data[0], ...todos]);
        setNewTask('');
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('todo_lists')
        .update({ completed: !completed, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data[0] : todo));
      }

    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const scheduleWakeUp = () => {
    const minutes = prompt('In how many minutes would you like to be reminded?');
    if (minutes) {
      const parsedMinutes = parseFloat(minutes);
      if (!isNaN(parsedMinutes) && parsedMinutes > 0) {
        const taskName = newTask.trim() || 'your task';
        setTimeout(() => {
          const audio = new Audio('https://raw.githubusercontent.com/akx/Notifications/master/WAV/andorra.wav');
          audio.play();
          alert(`Reminder: It's time for "${taskName}"!`);
        }, parsedMinutes * 60 * 1000);
        toast.success(`Reminder set for "${taskName}" in ${parsedMinutes} minutes.`);
      } else {
        toast.error('Please enter a valid number of minutes.');
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <Toaster richColors />
      <Card className="max-w-3xl mx-auto bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">My To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex items-center gap-2 mb-6">
            <Input
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              disabled={isSubmitting}
              className="flex-grow"
            />
            <Button type="submit" disabled={isSubmitting || newTask.trim() === ''}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={scheduleWakeUp}
              title="Schedule a reminder"
            >
              <Bell className="w-4 h-4" />
              <span className="ml-2">wake me</span>
            </Button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {todos.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  You have no to-do items yet. Add one above!
                </p>
              )}
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    todo.completed ? 'bg-muted/50 text-muted-foreground' : 'bg-background'
                  }`}
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={!!todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id, !!todo.completed)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`font-medium cursor-pointer ${
                        todo.completed ? 'line-through' : ''
                      }`}
                    >
                      {todo.task}
                    </label>
                    {todo.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {todo.priority && (
                        <Badge variant={todo.priority > 3 ? 'destructive' : 'secondary'}>
                          Priority: {todo.priority}
                        </Badge>
                      )}
                      {todo.due_date && (
                        <Badge variant="outline">
                          Due: {new Date(todo.due_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoPage;
