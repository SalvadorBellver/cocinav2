import React from 'react';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';

export const ShoppingList = () => {
  const { currentMenu } = useMenuStore();
  const shoppingList = useMenuStore(state => state.shoppingList);

  if (!currentMenu) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">No hay un menú activo</p>
      </div>
    );
  }

  const hasItems = shoppingList.size > 0;

  if (!hasItems) {
    return (
      <div className="text-center p-8">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Genera un menú semanal para ver la lista de la compra</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 glass-effect rounded-xl">
          <ShoppingBag className="w-5 h-5 text-pastel-pink-500" />
        </div>
        <h2 className="text-xl font-semibold">Lista de la Compra</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from(shoppingList.entries()).map(([item, { count }], index) => (
          <div
            key={item}
            className="card p-4 flex items-center justify-between animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="font-medium">{item}</span>
            {count > 1 && (
              <span className="text-sm px-2 py-1 bg-pastel-pink-50 text-pastel-pink-500 rounded-lg">
                x{count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};