import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
  id: number;
  name: string;
  description: string;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [currentFood, setCurrentFood] = useState({} as Foods);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    (async function getFoodsData() {
      const response = await api.get('/foods');
      setFoods(response.data);
    })();
  }, []);

  const handleAddFood = async (food: Foods) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(previous => [...previous, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Foods) => {
    
    try {
      const foodUpdated = await api.put(
        `/foods/${currentFood.id}`,
        { ...currentFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setAddModal(previous => !previous);
  }

  const toggleEditModal = () => {
    setEditModal(previous => !previous);
  }

  const handleEditFood = (food: Foods) => {
    setCurrentFood(food);
    setEditModal(true);
  }

  return (
    <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={addModal}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModal}
          setIsOpen={toggleEditModal}
          editingFood={currentFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  );
}